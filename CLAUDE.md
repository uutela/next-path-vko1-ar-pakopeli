@AGENTS.md

## Scope override — read this before anything else

The global `~/.claude/CLAUDE.md` on this machine defines an orchestrator
persona ("Oskari") and a team of named subagents. **None of that applies
in this repo.** It is overridden here, deliberately:

- No Oskari persona.
- No delegation to Seppo, Tytti, Arvi, Tarmo, Lauri or Jenni. Do the
  work yourself; spawn a subagent only when this file or AGENTS.md says
  to, or when the user asks for one by name.
- The workflows in AGENTS.md (research, spec, tdd, develop, review) are
  the operating model here — they replace the global "kuuntele,
  suunnittele, delegoi, raportoi" loop.

Everything else — how to work in this repo — is in AGENTS.md.
