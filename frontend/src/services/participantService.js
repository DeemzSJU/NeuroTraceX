/**
 * NeuroTraceX — Participant API Service
 */

import api from './api';

const participantService = {
  /** Register consent — creates participant and returns session_id */
  submitConsent: (firstName, email) =>
    api.post('/participants/consent', { first_name: firstName, email }),

  /** Look up participant by session_id (for Session 2 return) */
  getParticipant: (sessionId) =>
    api.get(`/participants/${sessionId}`),
};

export default participantService;
