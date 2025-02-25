---
title: Tough Luck - One Run Losses
pubDate: "2023-08-09"
tags:
  - blog
  - Baseball
  - Cardinals
---
The St. Louis Cardinals have massively under-performed this year. They were considered at the start of the season to be the favorite in the NL Central. Instead they are 16 games below .500. What happened?

The long answer is “a whole lot went wrong”, and that’s probably true for every bad team in the majors. But since I’m writing about _my_ bad team, one thing that jumps out is their record in 1 run games.

It’s a truism of baseball analytics that one-run games are essentially a tossup. Teams will, generally, trend more toward .500 in 1 run games than toward their record overall. Good teams, bad teams, they all tend to win about half of their 1 run games. It’s what you do in the other games that counts.

The Cardinals are 9-23 (.281) in 1 run games this year. That sucks! How much does it suck historically though? That’s a tough question to answer. You can’t just look it up across all of baseball history at any site I’m aware of. So I did what any self-respecting obsessive would do. I fired up Docker running the [boxball](https://github.com/droher/boxball) project and wrote a query for the retrosheet database. I think this is what we need:

```sql
select
  home.team,
  home.year,
  home.wins + away.wins as wins,   
  home.losses + away.losses as losses,   
  (home.wins + away.wins) - (home.losses + away.losses) to_500,   
  (home.wins + away.wins) / ((home.wins + away.wins) + (home.losses + away.losses)) as win_pct   
from (
  select   
    home_team as team,   
    YEAR(date) as year,   
    sum(
      case   
        when home_runs_score = (visitor_runs_scored + 1) then 1   
        else 0   
      end
    ) as wins,   
    sum(
      case   
        when home_runs_score = (visitor_runs_scored - 1) then 1   
        else 0   
      end
    ) as losses   
  from gamelog   
  group by home_team, year(date)
) as home
JOIN (
  select   
    visiting_team as team,   
    YEAR(date) as year,   
    sum(
      case   
        when home_runs_score = (visitor_runs_scored - 1) then 1   
        else 0   
      end
    ) as wins,   
    sum(
      case
        when home_runs_score = (visitor_runs_scored + 1) then 1   
        else 0   
      end
    ) as losses   
  from gamelog   
  where year(date) >= 1988   
  group by visiting_team, year(date)
) as away ON away.team = home.team 
  and away.year = home.year
order by to_500, home.losses + away.losses desc;
```

What you’ll find if you run that query is that the in pitching-dominant 1960s every game was required, by mandate of Ford Frick, to end either 1-0 or 2-1. It totally wrecks the curve. I took Sam Miller’s adage that modern baseball began in 1988 and limited the results accordingly.

What I found was that the Cardinals are not close to the most losses. The 1992 Dodgers and 2022 Marlins each lost 40. They’re not the worst winning percentage, the 2021 Diamondbacks went .244.

But they’re in the running. Out of 1020 team seasons since 1988, if the 2023 season were to end today they would rank:

-   Winning Percentage: 5th
-   Losses: 462nd
    -   This is for 2/3 of a season. If we were to extrapolate the current rate to a full season, 32 losses would rank 29th
-   Games below .500: 22nd
    -   If you extrapolate 2/3 of a season out to 14-32 the ranking jumps to 7th

So in terms of one-run loss luck, this isn’t the unluckiest team in the “modern” era, but it’s in the 90th+ percentile on all counts.

Not cool, man.

_Caveat: I should mention this dataset only runs through the 2022 season. It’s possible the Cardinals’ ranks could shift a bit from above if another team this year also has an awful one-run game record._
