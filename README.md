# Roomease

A modern, high-conversion landing page for **Roomease** — a roommate-finding platform that uses smart algorithms to match people based on lifestyle, budget, habits, personality, location, and schedule.

Five unique design variants are available at routes `/1`, `/2`, `/3`, `/4`, and `/5`, each with a distinct aesthetic, dark/light mode, and 3D elements where applicable.

## Tech stack

- **React** + **TypeScript**
- **Vite** (build tool)
- **Bun** (package manager / runtime)
- **React Router** (client-side routing)
- **Framer Motion** (animations)
- **React Three Fiber** + **Three.js** (3D scenes)

## Local development

```bash
bun install
bun dev
```

Open [http://localhost:8000](http://localhost:8000). Navigate to `/1`–`/5` for each design.

## Build

```bash
bun run build
```

Output is in `dist/`. Preview with:

```bash
bun run preview
```

*This project was bootstrapped with React + TypeScript + Vite.*
