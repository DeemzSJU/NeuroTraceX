/**
 * NeuroTraceX — Score & Results API Service
 */

import api from './api';

const scoreService = {
  /** Get divergence scores for a participant */
  getScores: (sessionId) =>
    api.get(`/scores/${sessionId}`),

  /** Trigger divergence score computation */
  computeScores: (sessionId) =>
    api.post(`/scores/compute/${sessionId}`),

  /** Get full results page data (scores + AI interpretation) */
  getResults: (sessionId) =>
    api.get(`/scores/results/${sessionId}`),
};

export default scoreService;
