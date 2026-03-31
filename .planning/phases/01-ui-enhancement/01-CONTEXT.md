# Phase 1: UI 增强与优化 - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Enhance the 数字传承人 UI with Eastern aesthetics (ink wash style), page transitions + micro-interactions via framer-motion, component architecture reorganization into a formal design system, route-based code splitting, and essential new UI components (Modal, Tooltip, Accordion, Form inputs). Performance optimization and maintainability/extensibility are explicit goals.

</domain>

<decisions>
## Implementation Decisions

### Animation Strategy
- **D-01:** Page transitions — animate route changes with fade/slide effects using framer-motion AnimatePresence
- **D-02:** Micro-interactions — add motion to buttons (press feedback), cards (hover lift), and form elements (focus transitions)
- **D-03:** Use framer-motion for all animation — existing CSS transitions remain for simple hover states but framer-motion is the primary animation library

### Visual Style Details
- **D-04:** Ink wash atmosphere — subtle ink gradients, brush stroke decorative SVG elements, layered paper textures
- **D-05:** Integrate ink wash elements as overlay/background effects, not as full-page fills (preserve readability)
- **D-06:** Maintain the existing 6-color palette (墨黑, 朱红, 天青, 茶绿, 宣纸白) — ink wash adds atmosphere via gradients/overlays, not new colors

### Component Architecture
- **D-07:** Design system + pages structure:
  - `src/ui/` — Primitive components (Button, Input, Badge, etc.)
  - `src/components/` — Composite UI (Card, Modal, Accordion, etc.)
  - `src/pages/` — Route pages (existing)
  - `src/layout/` — Header, Footer, Sidebar, PageWrapper
- **D-08:** Design tokens via Tailwind config + dedicated `src/tokens.js` or CSS custom properties for non-Tailwind values
- **D-09:** Animation primitives in `src/animations/` — shared framer-motion variants (fadeIn, slideUp, staggerChildren) for consistency

### Performance Optimization
- **D-10:** Route-based code splitting — React.lazy + Suspense for all pages except Home
- **D-11:** Image optimization — use WebP format where possible, add `loading="lazy"` to all images, add blur placeholder for hero images
- **D-12:** MediaPipe CDN loading remains as-is (loaded on VisionMentor page) — no change to existing CDN loading strategy

### UI Component Inventory
- **D-13:** New components to build in Phase 1:
  - Modal/Dialog — with overlay, close button, escape key support, framer-motion enter/exit
  - Tooltip — hover-triggered, positioned (top/bottom/left/right), framer-motion fade
  - Accordion/Collapsible — animated expand/collapse, single or multi-open variant
  - Form inputs — Input, Textarea, Select — all with consistent Eastern aesthetic styling, focus states, and error states
- **D-14:** Existing components (Button, Card, Navbar, Toast) remain as-is — enhancements only if needed for animation/style consistency

### Claude's Discretion
- Exact ink wash SVG brush stroke designs and placement
- Specific animation durations and easing curves
- CSS custom property naming conventions
- Loading skeleton implementation details
- Modal backdrop blur intensity
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Design
- `.planning/PROJECT.md` — Project overview, tech stack, design language (colors, fonts)
- `.planning/codebase/CONVENTIONS.md` — Existing coding conventions, React patterns

### Frontend
- `frontend/tailwind.config.js` — Current color palette and font configuration
- `frontend/src/index.css` — Existing utility classes (card-shadow, seal-border, vertical-text), scrollbar styles, markdown styles
- `frontend/src/components/Button.jsx` — Existing Button component (variants: primary, outline, ghost)
- `frontend/src/components/Card.jsx` — Existing Card component (hover effect pattern)
- `frontend/package.json` — framer-motion v12 dependency

[No external specs — requirements fully captured in decisions above]

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Button, Card, Toast components — already have Eastern aesthetic styling
- tailwind.config.js 6 custom colors + 3 custom fonts — foundation for design system
- index.css custom utilities (card-shadow, seal-border, vertical-text) — ink wash can layer on these
- framer-motion already installed — shared animation variants needed

### Established Patterns
- Component props: `className`, `variant`, `hoverEffect` — consistent prop naming
- Color usage: ink-black for text/primary, vermilion for accents/CTA, rice-paper for backgrounds
- Font usage: xiaowei for UI labels, calligraphy for headings, serif for body
- ErrorBoundary already implemented — reuse pattern for new error states

### Integration Points
- New design-system/ folder will be imported by existing pages/
- Animation primitives (src/animations/) will be imported by both ui/ and components/
- Route-based splitting requires wrapping routes in App.jsx with Suspense
- New Form inputs must integrate with existing api.js error handling

</code_context>

<specifics>
## Specific Ideas

- "Ink wash atmosphere" — think 数字水墨 (digital ink wash painting), subtle gradients, not heavy illustration
- Page transitions should feel like turning a scroll or page — smooth, directional
- Modal should feel like a traditional window/panel sliding into view
- Loading skeletons should use the rice-paper + noise texture background

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-ui-enhancement*
*Context gathered: 2026-03-31*
