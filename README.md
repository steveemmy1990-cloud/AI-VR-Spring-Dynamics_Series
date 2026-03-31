# 3D Spiral Spring Simulation

A high-fidelity 3D virtual reality simulation of a spiral spring with realistic physics, built with React, Three.js, and React Three Fiber.

## Features

- **High Visual Fidelity**: Detailed spiral spring geometry with metallic materials and realistic lighting
- **Spring Physics**: Realistic spring dynamics with stiffness, damping, and natural oscillation
- **Interactive Controls**: Click and drag to stretch or compress the spring
- **Smooth Animation**: Physics-based animation that responds naturally to user interaction
- **VR-Ready**: Built with Three.js for potential VR integration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Usage

- **Click and Drag**: Click on the spring and drag up/down to stretch or compress it
- **Mouse Wheel**: Zoom in/out
- **Right-Click Drag**: Rotate the camera around the scene

## Technology Stack

- **React**: UI framework
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for React Three Fiber
- **Vite**: Build tool and dev server

## Physics Parameters

The spring simulation uses realistic physics with the following parameters:
- **Spring Constant (k)**: 0.15 - Controls stiffness
- **Damping**: 0.08 - Controls oscillation decay
- **Rest Length**: 5 units - Natural length of the spring
- **Min/Max Length**: 2-10 units - Constraint limits

## Customization

You can adjust the physics parameters in `src/components/Spring.jsx`:
- `SPRING_CONSTANT`: Make the spring stiffer or softer
- `DAMPING`: Control how quickly oscillations settle
- `REST_LENGTH`: Change the natural length
- `MIN_LENGTH` / `MAX_LENGTH`: Set stretch/compression limits

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
