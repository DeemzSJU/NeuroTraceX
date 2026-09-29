/**
 * Structured Recall Questions (20 items total) — Frank & April Scene
 * Categories:
 * - 7 Factual questions (scored against ground truth key)
 * - 7 Interpretive questions (scored against group consensus vector embeddings)
 * - 6 Emotional questions (scored against group consensus vector embeddings)
 */

export const STRUCTURED_QUESTIONS = [
  // Factual Questions (1-7)
  { id: "q1", category: "factual", text: "How many characters were present in the conversation?" },
  { id: "q2", category: "factual", text: "Who spoke first?" },
  { id: "q3", category: "factual", text: "What was the first thing said when the conversation began?" },
  { id: "q4", category: "factual", text: "At what point did the tone shift noticeably?" },
  { id: "q5", category: "factual", text: "What specific object or location was mentioned?" },
  { id: "q6", category: "factual", text: "Who ended the conversation and how?" },
  { id: "q7", category: "factual", text: "How long did the conversation appear to last?" },

  // Interpretive Questions (8-14)
  { id: "q8", category: "interpretive", text: "Why do you think Frank behaved the way he did?" },
  { id: "q9", category: "interpretive", text: "What do you believe was the underlying reason for the conflict?" },
  { id: "q10", category: "interpretive", text: "Do you think the two characters knew each other well before this conversation?" },
  { id: "q11", category: "interpretive", text: "What do you think happened immediately before this conversation?" },
  { id: "q12", category: "interpretive", text: "How do you think this conversation will affect their relationship going forward?" },
  { id: "q13", category: "interpretive", text: "What do you think April truly wanted from this interaction?" },
  { id: "q14", category: "interpretive", text: "If you had to give this conversation a title, what would it be and why?" },

  // Emotional Questions (15-20)
  { id: "q15", category: "emotional", text: "How do you think Frank was feeling at the start of the conversation?" },
  { id: "q16", category: "emotional", text: "How do you think April was feeling by the end?" },
  { id: "q17", category: "emotional", text: "Which character did you feel more sympathetic toward and why?" },
  { id: "q18", category: "emotional", text: "What was the dominant emotional tone of the conversation overall?" },
  { id: "q19", category: "emotional", text: "Was there a moment that felt particularly emotionally intense? Describe it." },
  { id: "q20", category: "emotional", text: "How did the conversation make you feel as a listener?" }
];

export default STRUCTURED_QUESTIONS;

