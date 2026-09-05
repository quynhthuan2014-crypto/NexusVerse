# 🌌 NexusVerse

> **One Nexus. Infinite Worlds.**

NexusVerse is a modular browser-gaming universe. It currently contains the **NexusWarzone** FPS-style prototype and **NexusLurkers**, a polished 2D top-down arena shooter foundation, with more games planned for the same ecosystem.

## 🎮 Games

### NexusLurkers 2D — playable
- Top-down Canvas 2D arena
- WASD / arrow-key movement and sprint
- Mouse aim, fire and RMB aim mode
- Pistol, burst rifle, scatter and rail sniper
- Health + armor system
- Three tactical AI opponents
- Obstacles, collision and line-of-sight
- Pickups, coins and field shop
- Score, kills, streak, timer and combat feed
- Tactical minimap
- Procedural particles, tracers, muzzle flashes and screen shake
- Mobile touch fallback

Open it with the local server at `http://127.0.0.1:4000/apps/nexuslurkers/`.

### NexusWarzone — v0.1 prototype
- First-person-style mouse-look presentation
- WASD and arrow-key movement
- Sprint with Shift
- Aim with right mouse button
- Fire with left mouse button
- Reload with R
- Health, armor, score, ammo and match timer HUD
- Tactical outpost arena
- Multiple AI targets
- Zero external runtime dependencies

> NexusWarzone is intentionally a lightweight prototype, not a claim of a finished AAA FPS.

## 🚀 Run locally

Requirements: **Node.js 20+**.

```bash
npm install
npm start
```

Open `http://127.0.0.1:4000` for the launcher, or go directly to `http://127.0.0.1:4000/apps/nexuslurkers/`.

Run verification:

```bash
npm test
npm run check
```

## 🧭 Planned ecosystem

| Module | Purpose | Status |
|---|---|---|
| NexusLurkers | 2D arena shooter | 🟢 Playable foundation |
| NexusWarzone | FPS combat | 🟢 Prototype |
| NexusDuel | Fast arena combat | 🟡 Planned |
| NexusCraft | Voxel exploration/building | 🟡 Planned |
| Nexus Core | Shared systems | 🟡 Planned |
| Nexus Launcher | Unified game launcher | 🟡 Planned |

## 🏗️ Architecture

```text
NexusVerse
├── apps/
│   ├── nexuslurkers/    2D arena shooter
│   └── ...              Other games
├── packages/            Shared gameplay modules
├── server/              Local and future multiplayer services
├── assets/              Art, audio and branding
├── docs/                Architecture and development docs
├── tests/               Automated checks
└── .github/workflows/   CI verification
```

The architecture favors small reusable modules so future games can share player, physics, UI, AI and networking systems.

## 🌐 Multiplayer roadmap

The planned multiplayer layer uses an authoritative server model and WebSocket transport. LAN hosting will expose the local server at port `4000`; players on the same network can connect through the host address. VPN-based LAN solutions such as Radmin VPN can be used at the network layer when appropriate.

## 🛣️ Roadmap

### Phase 0 — Foundation
- [x] Repository foundation
- [x] Local server
- [x] Automated syntax/test checks
- [x] Launcher UI
- [x] NexusWarzone prototype
- [x] NexusLurkers 2D foundation

### Phase 1 — NexusLurkers Combat Polish
- [x] Responsive top-down arena
- [x] Player movement and sprint
- [x] Mouse aim/fire/reload
- [x] Four weapon profiles
- [x] AI opponents
- [x] Pickups and shop
- [x] Minimap and combat feed
- [ ] Weapon sounds
- [ ] Advanced VFX pipeline
- [ ] More maps and game modes

### Phase 2 — Multiplayer
- [ ] WebSocket gateway
- [ ] Server-authoritative state
- [ ] Match creation
- [ ] Player synchronization
- [ ] LAN discovery/connect flow
- [ ] Reconnect handling
- [ ] Network validation

### Phase 3 — Progression
- [ ] XP
- [x] Coins foundation
- [x] Shop foundation
- [ ] Weapon unlocks
- [ ] Skins
- [ ] Profiles

### Phase 4 — NexusVerse
- [ ] NexusDuel
- [ ] NexusCraft prototype
- [ ] Shared core packages
- [ ] Unified launcher
- [ ] Shared settings
- [ ] Modding documentation

## 🤝 Contributing

Contributions are welcome. Keep changes focused, test them locally, and document behavior that affects public APIs or gameplay.

## 🔐 Security

Do not report vulnerabilities in public issues. See `SECURITY.md` for the reporting process.

## 📜 License

See `LICENSE` for the repository license.
