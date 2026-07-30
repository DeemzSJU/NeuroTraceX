/**
 * NeuroTraceX — Experiment Flow Constants
 *
 * Defines the sequential steps, route paths, and metadata
 * for the experiment protocol.
 */

export const STEPS = {
  LANDING:     { id: 0, path: '/',               label: 'Welcome',             session: 0 },
  CONSENT:     { id: 1, path: '/consent',         label: 'Informed Consent',    session: 1 },
  REI:         { id: 2, path: '/rei',             label: 'Cognitive Style',     session: 1 },
  CRT:         { id: 3, path: '/crt',             label: 'Cognitive Reflection',session: 1 },
  STIMULUS:    { id: 4, path: '/stimulus',        label: 'Video Stimulus',      session: 1 },
  FREE_RECALL: { id: 5, path: '/free-recall',     label: 'Free Recall',         session: 1 },
  STRUCTURED:  { id: 6, path: '/structured',      label: 'Structured Questions',session: 1 },
  THANK_YOU:   { id: 7, path: '/thank-you',       label: 'Session Complete',    session: 1 },
  SESSION2:    { id: 8, path: '/session2/:sessionId', label: 'Delayed Recall',  session: 2 },
  RESULTS:     { id: 9, path: '/results/:sessionId',  label: 'Your Results',   session: 2 },
};

/** Total number of steps in Session 1 (for progress bar) */
export const SESSION1_TOTAL_STEPS = 7;

/** Steps that are part of Session 1 (consent through thank you) */
export const SESSION1_STEPS = Object.values(STEPS).filter(s => s.session === 1);

/** All step paths in order (for route guard validation) */
export const STEP_ORDER = Object.values(STEPS).map(s => s.path);
