/**
 * NeuroTraceX — Participant API Service
 */

import api from './api';

const participantService = {
  /** Register consent — creates participant and returns session_id */
  submitConsent: (firstName, email, userId = null) =>
    api.post('/participants/consent', { first_name: firstName, email, user_id: userId }),

  /** Look up participant by session_id (for Session 2 return) */
  getParticipant: (sessionId) =>
    api.get(`/participants/${sessionId}`),

  /** Look up participant progress details by user_id */
  getProgress: (userId) =>
    api.get(`/participants/user/${userId}/progress`),

  /** Mark Session 1 as completed in the database */
  completeSession1: (sessionId) =>
    api.post('/participants/session1/complete', { session_id: sessionId }),

  /** Mark Session 2 as completed in the database */
  completeSession2: (sessionId) =>
    api.post('/participants/session2/complete', { session_id: sessionId }),
};

export default participantService;
