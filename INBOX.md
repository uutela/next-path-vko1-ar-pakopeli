# INBOX

One line per thing noticed while working. Not implemented, not detoured into.

- ~~RESOLVED~~ `proximity.md` AC6 claimed to pin the inclusive boundary ("standing exactly
  on the radius counts as inside"), but its coordinate measures 19.999997645 m
  against a 20 m radius, so the test passes with `<` as well as `<=`. The
  criterion did not prove what it said it proved. Resolved by correcting the
  spec first: the inclusivity claim was dropped and the criterion now states
  what its coordinate actually tests, with the exact-boundary behaviour left
  explicitly unspecified.
- ~~RESOLVED~~ `checkAnswer` used `parseInt`, which stops at the first non-digit, so
  `"7abc"`, `"7.9"`, `"+7"` and `"7e0"` all count as 7. No criterion covers
  these and the keypad cannot produce them — `appendDigit` only ever appends
  `0`-`9`. It matters only if the function is called from somewhere else, which
  nothing does today.
