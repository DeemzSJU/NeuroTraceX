/**
 * NeuroTraceX — Root App Component
 *
 * Sets up React Router v6 routes for all experiment pages,
 * renders the app header and progress bar.
 */

import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { useSessionContext } from './context/SessionContext';
import { useAuth } from './context/AuthContext';
import participantService from './services/participantService';
import { STEPS, SESSION1_TOTAL_STEPS } from './constants/experimentFlow';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ConsentPage from './pages/ConsentPage';
import REIPage from './pages/REIPage';
import CRTPage from './pages/CRTPage';
import StimulusPage from './pages/StimulusPage';
import FreeRecallPage from './pages/FreeRecallPage';
import StructuredQuestionsPage from './pages/StructuredQuestionsPage';
import ThankYouPage from './pages/ThankYouPage';
import Session2Page from './pages/Session2Page';
import ResultsPage from './pages/ResultsPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, loading: authLoading } = useAuth();
  const { sessionId, setSession, setStep, setStructuredQIndex, currentStep } = useSessionContext();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };
  useEffect(() => {
    async function restoreProgress() {
      if (user?.id) {
        try {
          const progress = await participantService.getProgress(user.id);
          if (progress.has_consented && progress.session_id) {
            setSession(progress.session_id);
            if (progress.structured_q_index !== undefined && progress.structured_q_index !== null) {
              setStructuredQIndex(progress.structured_q_index);
            }

            const stepKey = progress.current_step.toUpperCase();
            if (STEPS[stepKey]) {
              const targetStep = STEPS[stepKey];
              setStep(targetStep.id);

              // Mapping of allowed paths for each step to prevent redirect loops
              const ALLOWED_PATHS_FOR_STEP = {
                consent: ['/consent'],
                rei: ['/rei'],
                crt: ['/crt'],
                stimulus: ['/stimulus'],
                free_recall: ['/free-recall'],
                structured: ['/structured'],
                thank_you: ['/thank-you'],
                session2: ['/session2', '/structured'],
                results: ['/results']
              };

              const allowedPaths = ALLOWED_PATHS_FOR_STEP[progress.current_step] || [];
              const isPathAllowed = allowedPaths.some(p => {
                const pattern = p.replace(':sessionId', progress.session_id);
                return location.pathname === pattern || location.pathname.startsWith(pattern.replace('/:sessionId', ''));
              });

              if (!isPathAllowed) {
                let targetPath = targetStep.path;
                if (targetPath.includes(':sessionId')) {
                  targetPath = targetPath.replace(':sessionId', progress.session_id);
                }
                navigate(targetPath);
              }
            }
          }
        } catch (err) {
          console.error("Failed to restore progress:", err);
        }
      }
    }
    if (!authLoading) {
      restoreProgress();
    }
  }, [user, authLoading, setSession, setStep, navigate, location.pathname]);
  const isSession1 = currentStep >= 1 && currentStep <= SESSION1_TOTAL_STEPS;
  const progress = isSession1 ? (currentStep / SESSION1_TOTAL_STEPS) * 100 : 0;
  const showHeader = location.pathname !== '/';
  return (
    <div className="app">
      {showHeader && (
        <>
          <header className="app-header">
            <div className="app-header__logo">
              <div className="app-header__logo-icon">N</div>
              NeuroTraceX
            </div>
            {isSession1 && (
              <span className="app-header__step">
                Step {currentStep} of {SESSION1_TOTAL_STEPS}
              </span>
            )}
            {user && (
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            )}
          </header>
          {isSession1 && (
            <div className="progress-bar">
              <div
                className="progress-bar__fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </>
      )}
      <Routes>
        <Route path={STEPS.LANDING.path} element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path={STEPS.CONSENT.path} element={<ConsentPage />} />
        <Route path={STEPS.REI.path} element={<REIPage />} />
        <Route path={STEPS.CRT.path} element={<CRTPage />} />
        <Route path={STEPS.STIMULUS.path} element={<StimulusPage />} />
        <Route path={STEPS.FREE_RECALL.path} element={<FreeRecallPage />} />
        <Route path={STEPS.STRUCTURED.path} element={<StructuredQuestionsPage />} />
        <Route path={STEPS.THANK_YOU.path} element={<ThankYouPage />} />
        <Route path={STEPS.SESSION2.path} element={<Session2Page />} />
        <Route path={STEPS.RESULTS.path} element={<ResultsPage />} />
      </Routes>
    </div>
  );
}
export default App;