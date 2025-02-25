---
title: Someone Turned Up the Entropy
pubDate: "2023-10-09"
tags:
 - Baseball
 - blog
---
As a postmortem on the Cardinals’ season, I looked at their actual wins vs. their “expected” wins based on WAR (I’m using Fangraphs WAR here). I’d been tracking this throughout the season, so I wasn’t surprised to see that at the trade deadline, they were 11.7 games worse than “expected” and at the end of the season, 9.5 worse (you can give away WAR faster than you can give away wins, and the Cardinals were playing a AAAA lineup for the much of the season post-deadline).

Ok, so how does that compare to the rest of the league? Were they miles beyond everyone else, or is that kind of gap common? This is how I thought to check that:

1.  Get Team WAR from Fangraphs Teams leaderboard for both pitching and hitting.
2.  Add Pitching and Hitting WAR together to get total WAR, and add that to replacement level (.295 winning percent)
3.  Get the diff between actual record and “expected” WAR record
4.  Calculate standard deviation of diff

I also did the same for July 31, 2022 and July 31, 2023. The results were similar, so I’ll stick with full season stats.

To my surprise the Cardinals weren’t even the worst under-performers of the season: the Royals (10.7) and Padres (9.9) were worse. (The Orioles overachieved by 11 games, the biggest differential plus or minus).

That seems crazy! How does it compare to last year?

For 2022, the biggest difference was Tampa Bay at +8.3. That would have placed _eighth_ in 2023. The standard deviation difference for 2022 was 2.2. For 2023, it was 3.4, more than one and half times the previous season!

What happened? Was it just a fluky year with a bunch of outlier seasons? Did something change in the game that fWAR hasn’t caught up to? Did I screw up a formula on one of my spreadsheets? Honestly, it could be any of the above, but I don’t think it’s the third thing. [Feel free to check my work](https://docs.google.com/spreadsheets/d/13HyBhB6V7JLnAzSayEHjyFDHBpZHfKOobhZs3viKUik/edit?usp=sharing).
