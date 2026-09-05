# NexusLurkers 2D Design Specification

## Goal
Build an original 2D top-down arena shooter inspired by the fast, readable feel of browser arena shooters, without copying Lurkers.io code, branding, or proprietary assets.

## Core experience
The player enters a neon tactical outpost, moves with WASD/arrow keys, aims with the mouse, fires with left click, aims with right click, reloads with R, and fights AI opponents. The first version must feel immediately playable without external services.

## Visual direction
Dark tactical background, cyan/amber/purple neon accents, glowing arena boundaries, readable silhouettes, muzzle flashes, bullet trails, hit flashes, particles, pickups, minimap, premium HUD, and responsive layout. All art is procedural Canvas drawing or original SVG/CSS artwork.

## Gameplay systems
- Player movement with acceleration, friction, sprint, and arena collision.
- Mouse aiming and pointer-lock support.
- Fire/reload loop with finite magazines and reserve ammo.
- Weapon profiles: pistol, burst rifle, shotgun, sniper.
- Health and armor, with armor absorbing part of incoming damage.
- AI opponents that patrol, acquire targets, avoid walls, shoot, retreat when weak, and respawn.
- Pickups for health, armor, ammo, and coins.
- Coins and an in-game shop panel for weapon upgrades between fights.
- Score, streak, timer, kills/deaths, and match end state.
- Minimap and scoreboard.
- Mobile-friendly touch buttons for movement/fire/aim fallback.

## Networking boundary
The first release is local single-player with deterministic data structures designed around a future network authority layer. The code must isolate player state, bots, projectiles, and match state so a later WebSocket server can synchronize snapshots without rewriting rendering.

## Safety and originality
Do not copy Lurkers.io source code, logos, maps, sprites, or other proprietary assets. Use the name NexusLurkers for the project and clearly describe it as an original inspired-by genre project.

## Acceptance criteria
- Game loads from `/apps/nexuslurkers/` through the existing Node static server.
- Controls work on desktop: WASD/arrows, Shift, mouse, left/right click, R, Esc.
- No external CDN or runtime dependency is required.
- Game loop remains playable on a normal desktop browser and scales to viewport size.
- HUD, minimap, AI, projectiles, pickups, shop, scoring, respawn, and match timer are functional.
- Node syntax tests pass for every JavaScript file.
