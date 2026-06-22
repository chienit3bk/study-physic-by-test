# `.claude/` — Claude Code configuration

This folder configures [Claude Code](https://docs.claude.com/en/docs/claude-code)
(and Cowork) for **study-physic-by-test**. It contains a quality-focused agent
suite for continuously improving the product, plus reusable skills for the
codebase's common workflows.

## Agents (`.claude/agents/`)

Specialised sub-agents you can invoke (e.g. `@code-reviewer`) or that Claude can
delegate to automatically.

| Agent | Use it to… |
| --- | --- |
| **code-reviewer** | Review backend/frontend changes for correctness, types, conventions, and maintainability before a PR. |
| **test-writer** | Bootstrap and grow the test suite (Vitest + Supertest / @vue/test-utils). Write a failing test first for bug fixes. |
| **security-auditor** | Audit auth/JWT/passwords/queries/deps for real, exploitable issues before releases. |

These three form a self-improvement loop: **review → test → secure**. Run them after
features, before merges, and before releases.

## Skills (`.claude/skills/`)

Step-by-step playbooks Claude loads on demand.

| Skill | Triggers when you… |
| --- | --- |
| **add-api-resource** | Add a new backend entity + CRUD endpoints (model, migration, controller, router). |
| **database-workflow** | Run/create migrations, seed, reset the DB, or keep `database/` docs in sync. |
| **frontend-feature** | Add a Vue view/component (pug + Polaris), a Pinia store, a route, or an API call. |

## How to use

- **Invoke an agent:** ask Claude, e.g. "Use the code-reviewer agent on my staged changes."
- **Skills load automatically** when your request matches their description; you can
  also mention them by name.
- Keep these files in version control so the whole team shares the same assistants.

## Extending

Add a new agent as `.claude/agents/<name>.md` (YAML frontmatter: `name`, `description`,
`tools`, `model` + a system prompt). Add a skill as `.claude/skills/<name>/SKILL.md`
(frontmatter: `name`, `description` + instructions). Mirror the existing files' style.
