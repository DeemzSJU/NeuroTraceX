/**
 * Structured Recall Questions (20 items total)
 * Categories:
 * - 7 Factual questions (scored against ground truth key)
 * - 7 Interpretive questions (scored against group consensus vector embeddings)
 * - 6 Emotional questions (scored against group consensus vector embeddings)
 */

export const STRUCTURED_QUESTIONS = [
  // Factual Questions (1-7)
  { id: "q1", category: "factual", text: "What was the first thing Character A said when entering the scene?" },
  { id: "q2", category: "factual", text: "What specific location or room were the two characters in?" },
  { id: "q3", category: "factual", text: "What object or item was explicitly mentioned during their conversation?" },
  { id: "q4", category: "factual", text: "Who initiated the topic of discussion, Character A or Character B?" },
  { id: "q5", category: "factual", text: "What action did Character B take right before the audio clip ended?" },
  { id: "q6", category: "factual", text: "What time of day or timeframe was mentioned in the dialogue?" },
  { id: "q7", category: "factual", text: "What specific phrase or question did Character B repeat?" },

  // Interpretive Questions (8-14)
  { id: "q8", category: "interpretive", text: "Why do you think Character A decided to leave or disengage?" },
  { id: "q9", category: "interpretive", text: "What do you believe was the main underlying source of conflict between the characters?" },
  { id: "q10", category: "interpretive", text: "What nature of relationship exists between Character A and Character B?" },
  { id: "q11", category: "interpretive", text: "Who do you think was primarily at fault for the misunderstanding?" },
  { id: "q12", category: "interpretive", text: "What do you predict will happen between the two characters next?" },
  { id: "q13", category: "interpretive", text: "What unspoken motive was Character A hiding from Character B?" },
  { id: "q14", category: "interpretive", text: "How sincere was Character B during the climax of the conversation?" },

  // Emotional Questions (15-20)
  { id: "q15", category: "emotional", text: "How do you think Character A was feeling at the very start of the conversation?" },
  { id: "q16", category: "emotional", text: "How do you think Character B was feeling by the end of the conversation?" },
  { id: "q17", category: "emotional", text: "What overall emotional mood or tone best describes the interaction?" },
  { id: "q18", category: "emotional", text: "How tense did you perceive the atmosphere between the characters to be?" },
  { id: "q19", category: "emotional", text: "Did either character demonstrate genuine empathy during the conversation? Explain." },
  { id: "q20", category: "emotional", text: "How did listening to this interaction make you feel emotionally?" }
];

export default STRUCTURED_QUESTIONS;
