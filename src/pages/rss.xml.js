import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	console.log("posts")
	console.log(posts)
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.sort(function (a, b) {
			if(a.pubDate == b.pubDate) {
				return 0;
			} else if( a.pubDate < b.pubDate){
				return -1;
			}  else {
				return 1;
			}
		})
			.map(function (post) {
			console.log(post.data);
			return ({
				...post.data,
				link: `/blog/${post.id}/`,
			})
		}),
	});
}
