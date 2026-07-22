/**
 * NeuroTraceX — Response Submission API Service
 */

import api from './api';

const responseService = {
  /** Submit all 40 REI-40 answers */
  submitREI: (sessionId, answers) =>
    api.post('/responses/rei', { session_id: sessionId, answers }),

  /** Submit all 3 CRT answers */
  submitCRT: (sessionId, answers) =>
    api.post('/responses/crt', { session_id: sessionId, answers }),

  /** Submit free recall text and duration */
  submitFreeRecall: (sessionId, recallText, durationSeconds) =>
    api.post('/responses/free-recall', {
      session_id: sessionId,
      recall_text: recallText,
      duration_seconds: durationSeconds,
    }),

  /** Submit a single structured question answer */
  submitStructuredAnswer: (sessionId, questionId, questionType, answerText, responseTimeMs, sessionNumber) =>
    api.post('/responses/structured', {
      session_id: sessionId,
      question_id: questionId,
      question_type: questionType,
      answer_text: answerText,
      response_time_ms: responseTimeMs,
      session_number: sessionNumber,
    }),

  /** Log audio playback event (start/end) */
  submitAudioEvent: (sessionId, eventType, timestamp) =>
    api.post('/responses/audio-event', {
      session_id: sessionId,
      event_type: eventType,
      timestamp: timestamp.toISOString(),
    }),
};

export default responseService;
