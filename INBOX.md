# INBOX

One line per thing noticed while working. Not implemented, not detoured into.

- ~~RESOLVED~~ `proximity.md` AC6 claimed to pin the inclusive boundary ("standing exactly
  on the radius counts as inside"), but its coordinate measures 19.999997645 m
  against a 20 m radius, so the test passes with `<` as well as `<=`. The
  criterion did not prove what it said it proved. Resolved by correcting the
  spec first: the inclusivity claim was dropped and the criterion now states
  what its coordinate actually tests, with the exact-boundary behaviour left
  explicitly unspecified.
