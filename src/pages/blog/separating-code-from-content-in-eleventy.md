---
title: "Separating Code From Content in Eleventy"
pubDate: "2025-01-16"
tags:
- "Tech"
- "Eleventy"
- "blog"
---

This site is built using the static site generator [Eleventy](https://www.11ty.dev/).
A plus side to static site generators is that the standard is for everything to be managed through flat files that can
be checked into version control. These get turned directly in to html pages, without needing a CMS and
a database to run on the server and render the pages. The drawback to this structure is that code is not well separated from data. I want
to open source the structure of the site, but I don't want anyone who forks it to immediately be able to publish everything
I've ever written online to their own site. There needs to be a separation of concerns.

As far as I can tell, from my own research and asking around on the [Eleventy Discord](https://www.11ty.dev/blog/discord/),
the Eleventy framework is not written with this use case in mind. I had to hack together my own approach.

## First Attempt: Passthrough Copy
The first thing I did was move the content files for the site into a separate git repo, which I added to the design repo
as a git submodule.

Eleventy allows what it calls pasthrough configuration, where you can tell it to move files from any
particular location within the app folder to the build output folder, like so:
```javascript
eleventyConfig.addPassthroughCopy({"./my_submodule/images": 'images'});
```

That works for files that can be passed through literally without being transformed, like CSS and images. But it doesn't
process files that need to be transformed. Setting something like:
```javascript
eleventyConfig.addPassthroughCopy({"./my_submodule/pages/*.md": 'pages'});
```

causes Eleventy to copy the Markdown files directly to the output folder where they would be served by the browser as
markdown text rather than tranformed into html. So that plan is out.

## Second Attempt: Moving Files On The `eleventy.before` Event
I realized that meant I needed to get the files into their proper locations before the build process began. This isn't as
simple as:
```bash 
cp my_submodule/*.md src/pages/
```
The markdown files in my submodule were in a specific directory structure, they couldn't just be directly copied to the
src folder.

Good news [^1]! I'm a programmer. That looks like the job for a recursive algorithm, and I'm always excited for the chance to write
recursion! I cranked out a script that uses nodeJs file system calls to copy files recursively into the correct directories,
with the correct structure. It actually worked, to the surprise of no one more than myself!

```javascript
const recurseThroughContent = async function(directoryName, dir) {
  let contentSubmoduleDirectoryName = "../my_submodule/content/" + directoryName;
  let item = await fs.readdirSync(contentSubmoduleDirectoryName)
  await item.forEach(async function(it) {
    if (it === ".DS_Store") {
      return;
    }
    await fs.stat(
        contentSubmoduleDirectoryName + "/" + it,
        async function (err, stats){
          if (err) {
            console.log("Captured error:")
            console.log(err)
          }
          if (stats.isFile()) {
            await fs.copyFile(
                contentSubmoduleDirectoryName + "/" + it,
                dir + "/" + directoryName + "/" + it,
                (err) => {
                  if (err) {
                    console.log("Captured error:")
                    console.log(err)
                  }
                }
            );
          } else if (stats.isDirectory) {
            let dirExists = fs.existsSync(dir + "/" + directoryName + "/" + it,)
            if (!dirExists) {
              fs.mkdirSync(dir + "/" + directoryName + "/" + it, {recursive: true});
            }
            await recurseThroughContent(directoryName + "/" + it, dir)
          }
        }
    );
  });
};

module.exports = async function (eleventyConfig) {
    eleventyConfig.on('eleventy.before', async ({dir}) => {
        // Clear the input directory
        await fsp.rm(dir.input + "/posts/**/*.md", {recursive: true, force: true});

        // Re-copy content to src folders
        console.log("Copying pages from content")
        await recurseThroughContent("pages", dir.input);
        console.log("Copying posts from content")
        await recurseThroughContent("posts", dir.input);
        console.log("Copying images from content")
        await recurseThroughContent("images", dir.input + "/assets");
        console.log("Copying files from content")
        await recurseThroughContent("files", dir.input + "/assets");
        console.log("Copying data from content")
        await recurseThroughContent("data", dir.input);
    });
    // etc.
}
```

It did in fact copy the files to the right location in the src folder and the build proceeded smoothly to create the output
I wanted.

I should say, the build proceeded smoothly _the first time_. One of the useful features of Eleventy is hot updates. When
you change a file that affects the build output, it automatically builds and applies it to your dev site. So every time
I so much as tweaked a line of css, the whole delete and rebuild process ran again. It often encountered errors in the
process, and crashed the dev server.

So I couldn't just have this process run every time there was any change to any file.

## The Conclusive Fix (Hopefully)
I did a little more thinking and realized that not only am I a programmer, I'm also fairly accomplished on the command
line.[^2] Could I devops my way out of this?

First of all, I realized writing my own recursive copy algorithm like I did above was reinventing the wheel. The rsync
utility has the ability to copy with directory structure intact.

```bash 
rsync -avmq \
 --include='*.md' \
  -f 'hide,! */' \
   ../my_submodule/pages/* .
```

So I wrote up a script to rsync each file type to the desired location in the src folder.

Then I realized I also had to write something to clear out the old files before rsyncing them over in case I renamed or
removed anything. You can do that with `find`.

```bash
find . -iname "*.md" -type f -delete
```

Wire that all together and you have a script that can move files into the src folder locations where they need to be,
and can clean up the files before the next run.

But wait! What happens when content changes in the content submodule? You can run:
```bash
git submodule update --remote
```
That will pull the latest from the submodule repo so it can be picked up by the rsync copy. But what branch will it pull
from? By default, `main`. But what if you're working on a different branch in your Eleventy project and don't want the
content for that branch to be in `main` yet? You'll need to create a branch on the content repo and then remember to
switch branches in the submodule before you run the copy script. What a pain!

So I added an argument to take a branch name from the command line and switch to that branch on the submodule. The final
product:

```bash
#!/usr/bin/env zsh

read "?Submodule branch? (default main): " branch
branch="${branch:-main}"

echo "Current directory:"
echo `pwd`
echo "Updating content submodule"
cd my_submodule
git fetch
git switch $branch
git pull
cd ../
echo "Deleting public/ contents"
rm -rf public/*
cd src
echo "Deleting markdown"
find . -iname "*.md" -type f -delete
echo "Deleting json data"
find ./data -iname "*.json" -type f -delete
echo "Deleting assets/images/*"
find ./assets/images -iname "*.*" -type f -delete
echo "Deleting assets/files/*"
find ./assets/files -iname "*.*" -type f -delete

# TODO - Convert this submodule path to a variable
echo "Syncing markdown"
rsync -avmq \
 --include='*.md' \
  -f 'hide,! *\/' \
   ../my_submodule/content/* .

echo "Syncing json to data"
rsync -avmq \
 --include='*.json' \
 --include='*.html' \
  -f 'hide,! */' \
   ../my_submodule/content/data/* \
   data

echo "Syncing images to assets/images"
rsync -avmq \
 --include='*' \
  -f 'hide,! */' \
   ../my_submodule/content/images/* \
   assets/images

echo "Syncing images to assets/images"
rsync -avmq \
 --include='*' \
  -f 'hide,! */' \
   ../my_submodule/content/files/* \
   assets/files
```
I saved that script in my Eleventy project under `scripts/set_up_submodule_files`

So then all you have to do is run `scripts/set_up_submodule_files` when you want to pull the latest from the submodule.

To be more npm-ish, I moved that to the `package.json` file:
```json
"scripts": {
  // Other build steps here ^
  "submodule_setup": "./scripts/set_up_submodule_files.sh"
}
```
So you can run `npm run submodule_setup` to pull all the content files into the right place.

A spot for improvement in this script would be to assume the submodule branch has the same name as your current Eleventy
repo when you press Enter, rather than defaulting to `main`.

[^1]: Is it?

[^2]: [Now you have two problems](https://regex.info/blog/2006-09-15/247)