# INBOX

One line per thing noticed while working. Not implemented, not detoured into.

- `proximity.md` AC6 claims to pin the inclusive boundary ("standing exactly
  on the radius counts as inside"), but its coordinate measures 19.999997645 m
  against a 20 m radius, so the test passes with `<` as well as `<=`. The
  criterion does not prove what it says it proves. Fixing it means correcting
  the spec first — either assert on a distance of exactly `radiusMeters`, or
  drop the inclusivity claim.
