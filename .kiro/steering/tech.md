# Technology Stack

## Build System & Framework
- **Build Tool**: Vite 6.3.1 with Hot Module Replacement (HMR)
- **Primary Framework**: React 19.0.0 with TypeScript 5.7.2
- **Secondary Framework**: Vue 3.5.17 (hybrid setup)
- **Package Manager**: npm (package-lock.json present)

## Core Dependencies
- **UI Library**: Arco Design (@arco-design/web-react)
- **Styling**: Tailwind CSS 4.1.4 with PostCSS
- **Routing**: React Router DOM 7.6.0
- **State Management**: React Context API
- **Animation**: Framer Motion 12.7.4

## Data Visualization & Maps
- **Charts**: Ant Design Charts, ECharts with React wrapper
- **Maps**: Leaflet with React Leaflet, Google Maps JS API
- **3D Graphics**: Three.js

## Development Tools
- **Linting**: ESLint 9.22.0 with TypeScript ESLint
- **Type Checking**: Strict TypeScript configuration
- **Development**: Stagewise Toolbar (dev mode only)

## Common Commands

### Development
```bash
npm run dev          # Start development server with HMR
npm run preview      # Preview production build locally
```

### Build & Deploy
```bash
npm run build        # TypeScript compilation + Vite build
npm run lint         # Run ESLint checks
```

### TypeScript Configuration
- Uses project references with separate configs for app and node
- Strict mode enabled with comprehensive linting rules
- Supports both React JSX and Vue SFC files