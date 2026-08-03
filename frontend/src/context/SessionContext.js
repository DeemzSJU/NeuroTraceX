/**
 * NeuroTraceX — Session Context
 *
 * React Context + useReducer for managing experiment state.
 * Tracks the participant's session ID, current step, and all collected data.
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// ── Initial State ────────────────────────────────────────────────
const initialState = {
  sessionId: null,
  currentStep: 0,
  sessionNumber: 1,
  participant: null,
  reiScores: null,
  crtScore: null,
  isLoading: false,
  error: null,
};

// ── Action Types ─────────────────────────────────────────────────
const ACTIONS = {
  SET_SESSION:      'SET_SESSION',
  SET_STEP:         'SET_STEP',
  NEXT_STEP:        'NEXT_STEP',
  SET_PARTICIPANT:  'SET_PARTICIPANT',
  SET_REI_SCORES:   'SET_REI_SCORES',
  SET_CRT_SCORE:    'SET_CRT_SCORE',
  SET_LOADING:      'SET_LOADING',
  SET_ERROR:        'SET_ERROR',
  RESET:            'RESET',
};

// ── Reducer ──────────────────────────────────────────────────────
function sessionReducer(state, action) {
  console.log("[SessionContext Reducer] action:", action.type, action.payload);
  switch (action.type) {
    case ACTIONS.SET_SESSION:
      return { ...state, sessionId: action.payload, error: null };

    case ACTIONS.SET_STEP:
      return { ...state, currentStep: action.payload };

    case ACTIONS.NEXT_STEP:
      return { ...state, currentStep: state.currentStep + 1 };

    case ACTIONS.SET_PARTICIPANT:
      return { ...state, participant: action.payload };

    case ACTIONS.SET_REI_SCORES:
      return { ...state, reiScores: action.payload };

    case ACTIONS.SET_CRT_SCORE:
      return { ...state, crtScore: action.payload };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case ACTIONS.RESET:
      return { ...initialState };

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────
const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState, () => {
    // Hydrate from sessionStorage if available (survives page refresh)
    const saved = sessionStorage.getItem('neurotracex_session');
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  });

  // Persist to sessionStorage on every state change
  useEffect(() => {
    console.log("[SessionContext useEffect] persisting state:", state);
    try {
      sessionStorage.setItem('neurotracex_session', JSON.stringify({
        sessionId: state.sessionId,
        currentStep: state.currentStep,
        sessionNumber: state.sessionNumber,
        reiScores: state.reiScores,
        crtScore: state.crtScore,
      }));
      console.log("[SessionContext useEffect] persisted successfully");
    } catch (e) {
      console.error("[SessionContext useEffect] persist failed:", e);
    }
  }, [state.sessionId, state.currentStep, state.sessionNumber, state.reiScores, state.crtScore]);

  // ── Action Creators ──────────────────────────────────────────
  const actions = {
    setSession: (id) => dispatch({ type: ACTIONS.SET_SESSION, payload: id }),
    setStep: (step) => dispatch({ type: ACTIONS.SET_STEP, payload: step }),
    nextStep: () => dispatch({ type: ACTIONS.NEXT_STEP }),
    setParticipant: (p) => dispatch({ type: ACTIONS.SET_PARTICIPANT, payload: p }),
    setREIScores: (s) => dispatch({ type: ACTIONS.SET_REI_SCORES, payload: s }),
    setCRTScore: (s) => dispatch({ type: ACTIONS.SET_CRT_SCORE, payload: s }),
    setLoading: (v) => dispatch({ type: ACTIONS.SET_LOADING, payload: v }),
    setError: (e) => dispatch({ type: ACTIONS.SET_ERROR, payload: e }),
    reset: () => {
      sessionStorage.removeItem('neurotracex_session');
      dispatch({ type: ACTIONS.RESET });
    },
  };

  return (
    <SessionContext.Provider value={{ ...state, ...actions }}>
      {children}
    </SessionContext.Provider>
  );
}

/**
 * Hook to access the session context.
 * Must be used within a <SessionProvider>.
 */
export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}

export default SessionContext;
