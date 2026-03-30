# Technology Stack

**Analysis Date:** 2026-03-30

## Languages

**Primary:**
- TypeScript 5.9.3 - Frontend (React 19)
- Python 3.x - Backend (FastAPI)

**Secondary:**
- JavaScript - Frontend (ES2020 target)

## Runtime

**Frontend:**
- Node.js (Vite dev server)
- Vite 5.4.0 - Build tool

**Backend:**
- Python 3.x with uvicorn ASGI server
- Port: 8002

**Package Manager:**
- npm 10.x+ (frontend)
- pip (backend)
- Lockfile: `frontend/package-lock.json` present

## Frameworks

**Frontend:**
- React 19.2.0 - UI framework
- React Router DOM 7.13.1 - Routing
- Tailwind CSS 3.4.1 - Styling
- PostCSS 8.5.6 - CSS processing

**Backend:**
- FastAPI - REST API framework
- Pydantic + Pydantic-Settings - Data validation
- Uvicorn - ASGI server

**Testing (Frontend):**
- ESLint 9.39.1 - Linting
- TypeScript ESLint 8.48.0 - TS linting

## Key Dependencies

**Frontend - Computer Vision:**
- `@mediapipe/hands` 0.4.1675469240 - Hand tracking
- `@mediapipe/camera_utils` 0.3.1675466862 - Camera integration
- `@mediapipe/drawing_utils` 0.3.1675466124 - Visualization
- `@tensorflow/tfjs` 4.22.0 - TensorFlow.js runtime

**Frontend - UI:**
- `framer-motion` 12.38.0 - Animations
- `lucide-react` 1.7.0 - Icons
- `echarts` 6.0.0 + `echarts-for-react` 3.0.6 - Charts
- `react-markdown` 10.1.0 - Markdown rendering
- `html2canvas` 1.4.1 - Screenshot capture

**Frontend - HTTP:**
- `axios` 1.13.6 - HTTP client

**Backend - AI/ML:**
- `langchain` + `langchain-community` + `langchain-openai` - LLM integration
- `langchain-experimental` - Experimental features

**Backend - Database:**
- `neo4j` - Graph database driver
- `sqlalchemy` - ORM
- `mysql-connector-python` - MySQL driver

**Backend - Image Processing:**
- `Pillow` - Image manipulation
- `qrcode` - QR code generation

**Backend - HTTP:**
- `httpx` - Async HTTP client
- `requests` - Sync HTTP client
- `python-multipart` - File upload support

**Backend - Utilities:**
- `python-dotenv` - Environment variable loading

## Configuration

**Frontend:**
- `frontend/vite.config.ts` - Vite configuration with React plugin
- `frontend/tailwind.config.js` - Tailwind with custom Chinese aesthetic colors
- `frontend/postcss.config.js` - PostCSS with Tailwind + Autoprefixer
- `frontend/eslint.config.js` - ESLint flat config with TypeScript and React Hooks
- `frontend/tsconfig.json` - TypeScript configuration

**Backend:**
- `backend/app/core/config.py` - Pydantic Settings for all configurations
- `backend/.env` - Environment variables (not committed)
- `backend/.env.example` - Example environment variables

**Theme Colors (Tailwind):**
- `ink-black`: #2B2B2B
- `rice-paper`: #F7F5F0
- `vermilion`: #C04851
- `cyan-glaze`: #5796B3
- `tea-green`: #CCD4BF
- `charcoal`: #4A4A4A

**Fonts:**
- `Noto Serif SC` - Serif font
- `Ma Shan Zheng` - Calligraphy font
- `ZCOOL XiaoWei` - Xiaowei font

## Platform Requirements

**Development:**
- Node.js 18+ (for Vite)
- Python 3.9+
- npm or yarn

**Production:**
- Node.js for building static frontend
- Python 3.9+ with uvicorn for backend
- Neo4j database
- MySQL database

---

*Stack analysis: 2026-03-30*
