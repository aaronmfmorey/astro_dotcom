---
title: "Fillet To The Top"
pubDate: "2024-12-08"
tags: 
  - blog
---
While reading the [Gutenberg eBook of _The King in Yellow_](https://www.gutenberg.org/ebooks/8492) I noticed I noticed 
the line "that eloquent preacher and good man, Monseigneur C——." You often see that sort of "censorship" in 19th century 
English writing, but I had no idea what the term for it was. I discovered that it's called a "fillet"

[Wikipedia](https://en.m.wikipedia.org/wiki/Fillet_(redaction)) does not provide a guide to tell if it's pronounced as 
in "-o-fish" or if it rhymes with "kill it." [The Cambridge online dictionary](https://dictionary.cambridge.org/us/dictionary/english/fillet)
says it's pronounced with a hard T. But on the other hand, it also says Americans pronounce the cut of meat form of the 
word that way, and I don't think I've ever heard that. So take that for what it's worth.

With a little more investigation, I figured out the ebook, as well as the fillet wikipedia entry, use two em-dashes to 
form the single character. Playing around with a couple of fonts on my phone, it appears most fonts tend to display 
multiple ems as a single character. Your mileage may vary, but I see the following as single lines:
1. —
2. ——
3. ———
4. But with most fonts, the fourth em dash and beyond are separated and begin to form their own fillet: ——— — and ——— ——
  (you'll note a subtle break after the first three ems). But! Since I'm using a LaTeX font on this site and Don Knuth
  is a mad man, the multiple em dashes show up as increasingly longer lines without breaks. I had to add a space to 
  simulate that break on this page.

There are double and triple em dash length single characters in Unicode: "⸺" (U+2E3A) and "⸻" (U+2E3B). So you can use 
the single character versions in most cases, in place of stacking up em dashes.

To learn more than you ever imagined there was to know about small horizontal lines: en.m.wikipedia.org/wiki/Dash
