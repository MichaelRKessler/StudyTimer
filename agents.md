# AGENTS.md

Guidelines and operational protocols for AI coding agents and human contributors working on **StudyTimer**.

---

## 1. Core Git & Collaboration Rules (CRITICAL)

> [!IMPORTANT]
> **NEVER push directly to `main`.**
> This repository is actively collaborated on by multiple developers and AI agents. Direct commits or pushes to the `main` branch are strictly forbidden.

### Branching & PR Workflow
1. **Always create a feature/fix branch**:
   - Create and checkout a new branch before making any code modifications.
   - Use descriptive branch naming conventions:
     - Features: `feat/<feature-name>` (e.g., `feat/pomodoro-timer-controls`)
     - Bug fixes: `fix/<issue-description>` (e.g., `fix/timer-pause-drift`)
     - Documentation: `docs/<topic>` (e.g., `docs/api-specs`)
     - Refactoring: `refactor/<area>` (e.g., `refactor/audio-alerts`)
2. **Keep branches focused and synchronized**:
   - Keep branch scope limited to a single task or feature to minimize merge conflicts.
   - Fetch and rebase/merge latest changes from `origin/main` frequently.
3. **Pull Request (PR) Requirements**:
   - All changes must be submitted as a Pull Request targeting `main`.
   - Provide clear PR descriptions summarizing:
     - What was changed and why.
     - Testing done and verification steps.
     - Any breaking changes or dependency additions.
   - Merging should only happen through PR approval and passing CI/checks.

---

## 2. General Agent Workflow

When assigned a task or responding to a request:

1. **Assess & Plan**:
   - Inspect the current repository structure and dependencies.
   - For multi-step or architecturally significant changes, outline an implementation plan before writing code.
2. **Branch Creation**:
   - Ensure the working tree is clean on `main` with latest changes pulled.
   - Switch to a newly created branch.
3. **Implementation**:
   - Follow existing architecture, naming conventions, and style.
   - Avoid unrelated refactoring or modifying files outside the task scope.
   - Preserve comments, documentation, and existing functionality.
4. **Verification & Testing**:
   - Run available test suites, linters, and type checkers.
   - Verify changes manually or with automated verification scripts whenever applicable.
5. **Commit & Pull Request**:
   - Write clear, concise, conventional commit messages (e.g., `feat: add sound notification on timer completion`).
   - Push the branch to the remote repository and prepare a PR.

---

## 3. Code Quality & Standards

- **Readability & Modularity**: Write self-documenting code with clear separation of concerns.
- **Error Handling**: Gracefully handle edge cases, unexpected user inputs, and environment failures.
- **Documentation**: Keep `README.md`, inline docstrings, and API documentation up to date with code changes.
- **Environment & Secrets**: Never hardcode secrets, credentials, or personal configuration in the repository. Use environment variables and `.env.example` templates.

