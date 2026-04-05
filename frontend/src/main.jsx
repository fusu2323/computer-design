import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OmniOrchestrator from './components/OmniOrchestrator';
import ToastProvider from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSkeleton from './components/LoadingSkeleton';
import './index.css';

// Page imports — eager loaded (Home and Intro stay synchronous)
import Intro from './pages/Intro';
import Home from './pages/Home';

// Lazy-loaded pages for code splitting
const CraftLibrary = lazy(() => import('./pages/CraftLibrary'));
const KnowledgeCurator = lazy(() => import('./pages/KnowledgeCurator'));
const MasterWorkshop = lazy(() => import('./pages/MasterWorkshop'));
const MyPractice = lazy(() => import('./pages/MyPractice'));
const VisionMentor = lazy(() => import('./pages/VisionMentor'));
const ShadowPuppet = lazy(() => import('./pages/ShadowPuppet'));
const CreativeWorkshop = lazy(() => import('./pages/CreativeWorkshop'));
const Embroidery = lazy(() => import('./pages/Embroidery'));
const Clay = lazy(() => import('./pages/Clay'));
const PaperCutting = lazy(() => import('./pages/PaperCutting'));
const Batik = lazy(() => import('./pages/Batik'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <OmniOrchestrator />
          <Suspense fallback={<LoadingSkeleton variant="page" />}>
            <Routes>
              <Route path="/" element={<Intro />} />
              <Route path="/home" element={<Home />} />
              <Route path="/craft-library" element={<CraftLibrary />} />
              <Route path="/craft/embroidery" element={<Embroidery />} />
              <Route path="/craft/clay" element={<Clay />} />
              <Route path="/craft/paper" element={<PaperCutting />} />
              <Route path="/craft/batik" element={<Batik />} />
              <Route path="/master-workshop" element={<MasterWorkshop />} />
              <Route path="/my-practice" element={<MyPractice />} />
              <Route path="/vision-mentor" element={<VisionMentor />} />
              <Route path="/knowledge-curator" element={<KnowledgeCurator />} />
              <Route path="/knowledge" element={<KnowledgeCurator />} />
              <Route path="/shadow-puppet" element={<ShadowPuppet />} />
              <Route path="/creative-workshop" element={<CreativeWorkshop />} />
              <Route path="/creative-artisan" element={<CreativeWorkshop />} />
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
