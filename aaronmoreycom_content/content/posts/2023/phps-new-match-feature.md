---
title: "PHP's New(ish) Match Feature"
pubDate: "2023-03-17"
tags: 
  - "Coding"
  - "PHP" 
  - "blog"
  - Tech
---

My company is on the verge of upgrading our website to PHP version 8, so I've been reading up in the new features. One that I really struggled to wrap my head around was [match](https://www.php.net/manual/en/control-structures.match.php). You can read the linked documentation for a description.

Every article that tries to explain match compares it to a switch statement. And superficially that's understandable. They're both syntactic sugar over a series of if/elseif blocks. But the similarities mostly end there.

- Match only allows one-line operations

- Match returns a value

- Switch automatically falls through, match does not require break statements

- Match throws an error if no match is found

- Match allows expressions in the comparison and checks for strict equality (===)

The list goes on. My response to reading all this was "Why do we need a wonky new switch statement?" And we really don't. But I think switch isn't a very apt comparison.

In my mind, the switch is a place to do business logic. I'll often do something like:

```php
switch ($account->type) {
    case 'checking':        
        $min = $account->getMinumum();        
        if ($account->balance < $min) {
            $account->assessFee(10.00);        
        }    
        $user->netWorth += $account->balance;
        break;
    case 'mortgage':
        $user->interestPaid += $account->interestThisPeriod;        
        $user->networth -= $account->balance;        
        if ($account->pastDueAmount > 0) {            
            $emailService->sendReminder($user, $account);        
        }        
        break;    
    case 'moneymarket':        
        // etc...        
}
```

That doesn't seem to be the sort of thing you can do easily with a match. A match seems like it's a better fit for returning a value conditionally. I, for example, unconditionally love the ternary operator and probably overuse it if anything. But something I commonly do is like:

```php
$beneficiaryName = !empty($account['beneficiary'])     
    ? $account['beneficiary']['name']    
    : "No beneficiary";
```

You could use match to do even more complicated conditional assignments:

```php
$userRelationship = match ($account->type) {
    'savings' => 'depositor',    
    'mortgage' => 'borrower',    
    'bond' => 'holder'    
    // etc.
};
```

Or you could use it to fire off simple conditional commands that would have otherwise required if/elseif blocks.

```php
match(true) {
    is_dir($fsObject) => tarAndGzip($fsobject),    
    is_executable($fsObject) => malwareScan($fsObject),    
    is_file($fsObject) => gzipFile($fsObject)
}
```

Something you may notice is that unlike switch cases, match cases ("arms"??) may not be mutually exclusive. You'll need to give thought to the order they're declared in, or risk hitting an unexpected result when a value happens to match a different arm than was intended. I haven't seen it started explicitly but the implication in the documentation I've read seems to be that it hits the first matching arm and doesn't check any of the following.

It's not being advertised well, but I think match is going to be great for n-ary assignment or firing off simple commands. I don't think it really stands to replace switch in any of the ways I use it.
