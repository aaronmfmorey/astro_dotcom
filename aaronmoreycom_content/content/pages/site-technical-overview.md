---
title: "Site Technical Overview"
pubDate: "2025-01-16"
layout: "../base.njk"
---

# Technical Details
## What Kind of Site Did I Want To Run?
For my purposes, I mainly intended for this to be a very simple site for collecting things I've written or worked on, with 
minimal interactivity. Using a large scale web framework with a database back-end and dynamic pages would be overkill. So the 
best option seemed to be to use a static site generator.

Static site generators (abbreviated SSG), are web frameworks that do the majority of processing before deploying to the webserver.
They build out the basic files: html, javascript, css, images, etc. into a single location so they can be served without
any server-side processing on the webserver itself. They load quickly on the user's browser and display the content they
were built to show with minimal fuss.

## Which Static Site Generator?
There are a number of well-known SSGs. Options include Jekyll, Hugo, Eleventy, Astro and Gatsby. You would probably do just fine
choosing any of those, but I ultimately settled on the dorkily-named [Eleventy](https://www.11ty.dev/). Its configuration
uses a tech stack I'm already very comfortable with: Javascript, Nunjucks (basically Twig), JSON and YAML.

## Getting Started
I always hate to start a site totally from scratch, so I looked through the [Eleventy themes site](https://www.11ty.dev/docs/starter/)
for a template. I settled on [Eleventy Academic Template](https://eleventy-academic-template.netlify.app/), which fit the minimalist
aesthetic I was looking and (most crucially) just worked out of the box on Eleventy version 3.0. I've since heavily modified it, but 
it was a great base for starting out.

## What did you learn?
First of all, I learned the basics of the Eleventy framework, but you're not here to read about that. You can read [the
documentation](https://www.11ty.dev/docs/) yourself.

### CSS Has Changed
I haven't worked heavily in design in quite a few years, so I was shocked to learn how much CSS has improved.

#### Variables
CSS now has variables, that can be defined with two dashes and referenced throughout the file with `var()`:

```css
:root {
    --ff-sans-serif: Quicksand, Roboto, Helvetica, sans-serif;
}

body {
    font-family: var(--ff-sans-serif);
}
```

#### Useful Properties
There are a bunch of cool new css properties that I hadn't had the chance to use in the past.
 - `text-wrap: balance` - tries to arrange short blocks of text to make line lengths even when there is a linebreak. I 
   use it in most of the header elements of ths site and it looks better in a subtle way that you almost don't notice 
   except in its absence.
 - `display: table` - this might be an older property, but it came in handy, for example on the blog's [tags page](/posts/tags/gene-wolfe/)
   to make the columns align nicely (almost like a table) without the raggedy edges you would get if they were placed
   directly next to each other without this property set.
 - `flex` positioning - I don't have it on any parts of the site that are live now, but when I get the responsive layout
   finalized, it will likely be using a lot of flexes. Flex just does what you want positioning to do, without a lot of 
   fighting with it like old school CSS used to require.

## Separating Content From Code
This turned out to be a doozy: [I outlined my process in this post](/posts/2025/separating-code-from-content-in-eleventy/).

## How To Deploy To Production
The cool thing about a static site generator is that it creates all its output as static files in a single output 
directory. Ideally I'd run the go-live process through Github Actions, but I haven't figured out exactly what it takes
to get that working with my host. For the time being, I'm deploying directly from dev with a script in `scripts/deploy_to_nfs`:

```bash
#!/usr/bin/env zsh

cd /Volumes/Projects/Projects/amo11ty

rsync \
    -auvc \
    --delete \
    -e "ssh -i ~/.ssh/privatekey" \
    public/* \
    myaccount@ssh.nyc1.nearlyfreespeech.net:/home/public/
```

## Where Can I Learn From Your ~~Mistakes~~ Experience?
The code is hosted on [Github](https://github.com/aaronmfmorey/amo11ty). When it's ready for public availability,
I'll make the repository public. I probably won't make the content submodule repo public, but there will be instructions
for setting up the site using your own.