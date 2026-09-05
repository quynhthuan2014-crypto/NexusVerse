# NexusLurkers 2D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, dependency-free 2D top-down arena shooter at `/apps/nexuslurkers/` with combat, AI, pickups, shop, HUD, minimap, and responsive controls.

**Architecture:** A self-contained browser client under `apps/nexuslurkers/` uses Canvas 2D for the game renderer and small focused modules for configuration, state, simulation, input, rendering, and UI. The existing root Node server serves it as static content; future multiplayer can synchronize the state objects without replacing the renderer.

**Tech Stack:** HTML5 Canvas 2D, vanilla JavaScript ES modules, CSS, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-05-nexuslurkers-2d-design.md`

## Global Constraints

- No external CDN or runtime dependency.
- 2D top-down presentation only.
- Original NexusLurkers naming and procedural artwork; no copied Lurkers.io assets or source.
- Desktop controls: WASD/arrows, Shift, mouse, left/right click, R, Esc.
- The existing root Node server remains compatible.

---

### Task 1: Create the launcher and visual shell

**Files:**
- Create: `apps/nexuslurkers/index.html`
- Create: `apps/nexuslurkers/style.css`

**Interfaces:**
- Produces the launcher screen, game canvas, HUD containers, minimap, shop, scoreboard, controls help, and mobile controls.

- [ ] **Step 1:** Create semantic launcher markup with a single game canvas and overlays.
- [ ] **Step 2:** Add responsive CSS for desktop and mobile, including neon borders, readable HUD cards, dialog states, and pointer-lock hint.
- [ ] **Step 3:** Verify all asset references are local and relative to `apps/nexuslurkers/`.

### Task 2: Build game state and input layer

**Files:**
- Create: `apps/nexuslurkers/game.js`

**Interfaces:**
- `createGameState()` returns the full serializable match state.
- `createInput(canvas)` returns normalized keyboard, mouse, pointer-lock, and touch state.
- `updateGame(state, input, dt)` advances simulation.

- [ ] **Step 1:** Define player, bots, weapons, projectiles, pickups, walls, particles, shop inventory, and match timer in state.
- [ ] **Step 2:** Implement keyboard/mouse/touch input and pointer-lock fallback.
- [ ] **Step 3:** Implement movement acceleration, friction, sprint, collision against arena walls/cover, and boundary clamping.

### Task 3: Add combat, AI, pickups, scoring, and shop

**Files:**
- Modify: `apps/nexuslurkers/game.js`

**Interfaces:**
- `fireWeapon(state, owner, weaponId, angle)` spawns projectiles according to weapon profile.
- `damageActor(target, amount, source)` applies armor before health.
- `respawnBot(state, bot)` resets a defeated bot after a delay.

- [ ] **Step 1:** Add pistol, burst rifle, shotgun, and sniper profiles with distinct fire cadence, spread, damage, magazines, and reload timing.
- [ ] **Step 2:** Add projectile movement, wall collision, actor hit detection, muzzle flash, tracer and impact particles, and screen-shake state.
- [ ] **Step 3:** Add bot behavior: patrol, seek player, line-of-sight checks, obstacle avoidance, firing, retreat, and respawn.
- [ ] **Step 4:** Add health/armor/ammo/coin pickups and shop purchases.
- [ ] **Step 5:** Add kill/death score, streak, timer, and match-end state.

### Task 4: Render the game and UI

**Files:**
- Modify: `apps/nexuslurkers/game.js`

**Interfaces:**
- `renderGame(state, ctx, viewport)` draws the complete world.
- `renderUI(state)` updates HUD text and panels.

- [ ] **Step 1:** Draw arena floor grid, glow lines, cover, spawn zones, and decorative tactical props procedurally.
- [ ] **Step 2:** Draw actors as original stylized silhouettes with directional weapons, health bars, team markers, and hit flashes.
- [ ] **Step 3:** Draw projectiles, particles, pickup icons, and screen effects.
- [ ] **Step 4:** Draw minimap and scoreboard from the same state used by simulation.
- [ ] **Step 5:** Add accessible labels, clear focus states, and a pause/shop overlay.

### Task 5: Wire startup, mobile controls, and runtime safeguards

**Files:**
- Modify: `apps/nexuslurkers/index.html`
- Modify: `apps/nexuslurkers/game.js`

- [ ] **Step 1:** Start the game only after DOM and canvas availability checks.
- [ ] **Step 2:** Show a clear recovery panel for unsupported Canvas contexts instead of leaving dead buttons.
- [ ] **Step 3:** Add requestAnimationFrame loop with clamped delta time and resize handling.
- [ ] **Step 4:** Add mobile virtual-stick/buttons while preserving desktop controls.

### Task 6: Add tests and documentation

**Files:**
- Create: `apps/nexuslurkers/README.md`
- Create: `tests/nexuslurkers.test.js`

- [ ] **Step 1:** Add Node tests for module loading, weapon configuration, damage calculation, score changes, and state serialization shape.
- [ ] **Step 2:** Add usage instructions for `http://127.0.0.1:4000/apps/nexuslurkers/`.
- [ ] **Step 3:** Document that multiplayer is a later network layer and this release is a local playable foundation.

### Task 7: Verify and update project roadmap

**Files:**
- Modify: `README.md`
- Modify: `ROADMAP.md`

- [ ] **Step 1:** Link NexusLurkers from the root README and roadmap.
- [ ] **Step 2:** Run `node --test` and `node --check` across NexusLurkers files.
- [ ] **Step 3:** Review all generated files for broken relative paths and inconsistent terminology.
