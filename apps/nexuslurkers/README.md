# NexusLurkers 2D

**One Nexus. Infinite Arenas.**

NexusLurkers is an original 2D top-down arena shooter module for NexusVerse. It is genre-inspired rather than a copy of Lurkers.io and uses procedural/original presentation only.

## Current build

- Responsive Canvas 2D arena
- WASD/arrow movement with sprint
- Mouse aim, left-click fire and right-click aim mode
- Pistol, burst rifle, scatter and rail sniper
- Reloading and reserve ammunition
- Health + armor damage model
- Three AI opponents with patrol/chase/retreat behavior
- Obstacles, line-of-sight checks and collision
- Health, armor, ammo and coin pickups
- Field shop for weapons, armor, medicine and ammo
- Score, kills, streak, deaths and 10-minute match timer
- Tactical minimap and combat feed
- Procedural particles, tracers, muzzle flashes, impact effects and screen shake
- Mobile touch controls fallback

## Run

From the repository root:

```bash
npm start
```

Open:

`http://127.0.0.1:4000/apps/nexuslurkers/`

## Controls

| Action | Desktop |
|---|---|
| Move | WASD / Arrow Keys |
| Sprint | Shift |
| Aim | Right Mouse Button |
| Fire | Left Mouse Button |
| Reload | R |
| Shop | E |
| Pause | Esc |

## Architecture

`game.js` keeps simulation state separate from the Canvas renderer. The state is intentionally serializable so a future authoritative multiplayer server can synchronize player, bot, projectile and match snapshots.

## Future multiplayer

The current build is deliberately local and dependency-free. The next networking layer should add an authoritative Node/WebSocket service without replacing the gameplay state schema or renderer.
