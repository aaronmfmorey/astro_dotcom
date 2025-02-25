---
title: "Programming Language Thoughts"
pubDate: "2023-06-14"
tags:
 - blog
 - Coding
 - Tech
---

I was thinking about why I always find case/switch statements in programming languages unintuitive to read and write. It's always been kind of an itch in the back of my mind but I hadn't really given it conscious thought. But today I realized the problem is all\* programming languages that use curly braces to define blocks of code structure switch/case statements without them for some reason.

Why did everyone decide to do this:

``` javascript
switch(value) {
    case 0: // case block denoted with colon
        if(doStuff) {
            someStuff();         
        }
        break;  

    case 1:        
    … etc …
}
```

Instead of this:

``` javascript
switch(value) {
    case 0 { // Case block denoted with brace 
        if(doStuff) {
            someStuff();         
        }         
        break;     
    }    
    
    case 1 {
        … etc …    
    }
}
```

The second would be much more consistent with the rest of the language, and would also simplify finding the end of a long case statement by the closing bracket, rather than trying to look for the next "case" keyword. Is there a specific reason that parsers handle the first way better or something? Or is it just a decision Kernigan and Ritchie made in 1978 that no one has bothered to reconsider?

\* It's possible it's not literally all, but all that I've used.
