# Project Structure

## Root Level Organization
```
├── src/                    # Source code
├── public/                 # Static assets and public files
├── .kiro/                  # Kiro AI assistant configuration
├── .vercel/                # Vercel deployment configuration
├── node_modules/           # Dependencies
└── [config files]          # Various configuration files
```

## Source Code Structure (`src/`)
```
src/
├── components/             # React components organized by feature
│   ├── common/            # Shared/reusable components
│   ├── controltower/      # Control tower specific components
│   ├── controltower-client/ # Client-specific control tower components
│   ├── home/              # Home page components
│   ├── layout/            # Layout components
│   ├── pages/             # Page-level components
│   ├── platformadmin/     # Platform administration components
│   ├── portalhome/        # Portal home components
│   ├── walltechhome/      # Wall tech home components
│   └── AppContent.tsx     # Main app content component
├── contexts/              # React Context providers
├── assets/                # Static assets (images, fonts, etc.)
├── containersaas/         # Container SaaS related code
├── main.tsx               # Application entry point
├── App.tsx                # Root App component
├── index.css              # Global styles
├── vite-env.d.ts          # Vite environment types
└── vue-shims.d.ts         # Vue TypeScript declarations
```

## Public Assets (`public/`)
- Static files served directly
- Images, icons, and logos
- QR codes directory
- Manifest and robot files for PWA/SEO

## Component Organization Patterns
- **Feature-based**: Components grouped by business domain/feature
- **Hierarchical**: Clear separation between common, page-specific, and feature components
- **Context-driven**: Shared state managed through React Context providers
- **Hybrid support**: Both React (.tsx) and Vue (.vue) components supported

## File Naming Conventions
- React components: PascalCase with `.tsx` extension
- Context files: PascalCase with "Context" suffix
- Configuration files: lowercase with appropriate extensions
- Assets: descriptive names, organized in subdirectories

## Architecture Notes
- Single-page application with client-side routing
- Context API for state management (no Redux/Zustand)
- Modular component architecture supporting multiple business domains
- Hybrid React/Vue setup for flexibility