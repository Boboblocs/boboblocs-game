# Boboblocs

A small 3D block-world game built with Three.js.

## Features
- 3D voxel-style map
- Player movement with WASD and arrow keys
- Third-person and first-person camera toggle
- on-screen controls for touch devices
- blocky houses, roads, trees, and NPCs

## Run locally

Because the project loads the Three.js package via a CDN, a simple local web server is enough.

### Option 1: Python

```bash
cd boboblocs-game
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Option 2: VS Code Live Server

Open `index.html` with a local static server extension such as Live Server.

## Controls
- `W`, `A`, `S`, `D` — movement
- Arrow keys — movement
- `Камера` button — switch camera mode

## Files
- `index.html` — page shell
- `style.css` — layout and controls styling
- `script.js` — game logic and world generation

