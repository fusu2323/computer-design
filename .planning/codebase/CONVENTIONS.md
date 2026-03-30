# Coding Conventions

**Analysis Date:** 2026-03-30

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `Button.jsx`, `HandTracking.jsx`, `VisionMentor.jsx`)
- Services: camelCase (e.g., `api.js`, `endpoints.js`)
- API endpoints: snake_case (e.g., `vision_mentor.py`, `knowledge_curator.py`)
- Route handlers: PascalCase (e.g., `VisionMentor.jsx`, `KnowledgeCurator.jsx`)

**Functions:**
- React components: PascalCase (e.g., `const Button = ...`, `const VisionMentor = ...`)
- Regular functions: camelCase (e.g., `calculateDistance`, `handleSend`)
- Python functions: snake_case (e.g., `calculate_distance`, `evaluate_embroidery`)

**Variables:**
- React state: camelCase (e.g., `isLoading`, `activeScenario`, `metricValue`)
- Props: camelCase (e.g., `onResults`, `scenario`, `className`)
- Python variables: snake_case (e.g., `landmarks`, `session_id`, `feedback_text`)

**Types:**
- TypeScript interfaces: PascalCase with `BaseModel` suffix pattern in Python
- React component props interfaces: Not explicitly defined (using loose typing)

## Code Style

**Formatting:**
- Tool: Prettier via ESLint integration
- 2-space indentation for JSX/TSX
- Trailing commas in object/array literals
- Single quotes for strings (consistent with ESLint defaults)

**Linting:**
- Tool: ESLint 9.x with flat config
- Plugins: `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Rules: Follows recommended configs from js, tseslint, react-hooks, react-refresh

**TypeScript Configuration:**
- `tsconfig.app.json`: Strict mode enabled
- `tsconfig.node.json`: For Vite config files

## Import Organization

**Order (frontend/src/main.jsx example):**
1. React and React DOM imports
2. React Router imports
3. Page/component imports
4. Provider/wrapper imports
5. CSS imports
6. Local components

**Path Aliases:**
- No explicit path aliases configured (using relative paths)
- Vite supports `@` alias but not currently in use

## Error Handling

**Frontend:**
- ErrorBoundary component for catching React errors (`frontend/src/components/ErrorBoundary.jsx`)
- Class-based ErrorBoundary with getDerivedStateFromError and componentDidCatch
- Provides reset and reload options for recovery
- API errors handled via axios interceptors in `frontend/src/services/api.js`
- Error messages: Chinese (e.g., "网络错误，请稍后重试")

**Backend:**
- Try-except blocks in service methods (e.g., `backend/app/services/llm_service.py`)
- Returns fallback messages on error (e.g., "抱歉，AI 服务暂时不可用。")
- Global exception handler not explicitly implemented
- FastAPI's built-in validation via Pydantic models

**Logging:**
- Frontend: console.error for critical errors (e.g., `console.error('ErrorBoundary caught an error:', error, errorInfo)`)
- Backend: print() for logging (e.g., `print("LangChain LLM initialized successfully with DeepSeek")`)
- No structured logging framework (e.g., loguru, winston)

## Comments

**When to Comment:**
- Chinese comments for business logic (e.g., "竖起食指中指，捏合其他三指，模仿兔子手影。")
- Inline explanations for complex algorithms (e.g., MediaPipe setup)
- Missing: No JSDoc or TSDoc annotations observed

**JSDoc/TSDoc:**
- Not used in the codebase
- No documentation for component props

## Function Design

**Size:**
- Small, focused functions (e.g., `calculateDistance` is 1 line)
- Complex logic in separate utility functions

**Parameters:**
- Props: Destructuring in functional components
- Python: Type hints via Pydantic models (e.g., `class PoseRequest(BaseModel)`)

**Return Values:**
- Frontend: Implicit returns in arrow functions
- Backend: Explicit type hints, dictionary returns for JSON

## Module Design

**Exports:**
- Components: Default exports (e.g., `export default Button`)
- Services: Named exports (e.g., `export const endpoints = {...}`)

**Barrel Files:**
- Not used - imports directly from source files

## React Patterns

**Component Structure:**
```jsx
const ComponentName = ({ prop1, prop2 }) => {
  // State hooks
  const [state, setState] = useState(default);

  // Effects
  useEffect(() => {}, [dependencies]);

  // Handlers
  const handleClick = () => {};

  // Render
  return <div>...</div>;
};
```

**Hooks Usage:**
- useState for local state
- useEffect for side effects and subscriptions
- useRef for mutable refs (e.g., video references)
- useSearchParams from react-router-dom
- Custom hooks (e.g., `useToast`)

**State Management:**
- Local component state via useState
- URL parameters via useSearchParams
- No global state management library (Zustand, Redux)
- localStorage for session persistence

## Backend Patterns

**FastAPI Structure:**
- Routers defined in `app/api/endpoints/`
- Services in `app/services/`
- Configuration in `app/core/config.py`
- Entry point: `run.py`

**API Response Format:**
- Dictionary returns (e.g., `return {"status": "success", "score": result["score"]}`)
- No consistent response wrapper

---

*Convention analysis: 2026-03-30*