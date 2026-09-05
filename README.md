# 🌌 NexusVerse

> **One Nexus. Infinite Worlds.**

NexusVerse is a modular browser-gaming universe. The project starts with **NexusWarzone**, a first-person local prototype, and is designed to grow into a shared ecosystem for games, AI, networking, physics and reusable gameplay systems.

## 🎮 Current status

### NexusWarzone — v0.1 prototype
- First-person-style mouse-look presentation
- WASD and arrow-key movement
- Sprint with Shift
- Aim with right mouse button
- Fire with left mouse button
- Reload with R
- Health, armor, score, ammo and match timer HUD
- Tactical outpost arena
- Multiple AI targets with chase/attack behavior
- Zero external runtime dependencies
- Local server on port 4000

> This first release is intentionally lightweight and dependency-free. It is a playable foundation, not a claim of a finished AAA FPS.

## 🚀 Run locally

Requirements: **Node.js 20+**.

```bash
npm install
npm start
```

Open `http://127.0.0.1:4000`.

Run verification:

```bash
npm test
npm run check
```

## 🧭 Planned ecosystem

| Module | Purpose | Status |
|---|---|---|
| NexusWarzone | FPS combat | 🟢 Prototype |
| NexusDuel | Fast arena combat | 🟡 Planned |
| NexusCraft | Voxel exploration/building | 🟡 Planned |
| Nexus Core | Shared systems | 🟡 Planned |
| Nexus Launcher | Unified game launcher | 🟡 Planned |

## 🏗️ Architecture

```text
NexusVerse
├── apps/              Game applications
├── packages/          Shared gameplay modules
├── server/            Local and future multiplayer services
├── assets/            Art, audio and branding
├── docs/              Architecture and development docs
├── tests/              Automated checks
└── .github/workflows/ CI verification
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

### Phase 1 — FPS Core
- [x] Camera presentation
- [x] Movement
- [x] Mouse look
- [x] Shooting
- [x] Health
- [x] HUD
- [x] Tactical map
- [x] Bot targets
- [ ] Improved collision/physics
- [ ] Full weapon data system
- [ ] Audio and VFX pipeline

### Phase 2 — Multiplayer
- [ ] WebSocket gateway
- [ ] Server-authoritative player state
- [ ] Match creation
- [ ] Player synchronization
- [ ] LAN discovery/connect flow
- [ ] Reconnect handling
- [ ] Network validation

### Phase 3 — Progression
- [ ] XP
- [ ] Coins
- [ ] Shop
- [ ] Weapon unlocks
- [ ] Skins
- [ ] Profiles

### Phase 4 — NexusVerse
- [ ] NexusDuel
- [ ] NexusCraft prototype
- [ ] Shared core packages
- [ ] Launcher
- [ ] Shared settings
- [ ] Modding documentation

## 🤝 Contributing

Contributions are welcome. Keep changes focused, test them locally, and document behavior that affects public APIs or gameplay.

## 🔐 Security

Do not report vulnerabilities in public issues. See `SECURITY.md` for the reporting process.

## 📜 License

See `LICENSE` for the repository license.
