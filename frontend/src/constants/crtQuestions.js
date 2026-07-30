/**
 * Cognitive Reflection Test (CRT) Items (Frederick, 2005)
 * 3 items measuring analytical suppression vs intuitive shortcuts.
 */

export const CRT_QUESTIONS = [
  {
    id: 1,
    text: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost in cents?",
    hint: "Enter a number (e.g. 5 or 0.05)",
    correctAnswer: "0.05",
  },
  {
    id: 2,
    text: "If it takes 5 machines 5 minutes to make 5 widgets, how many minutes would it take 100 machines to make 100 widgets?",
    hint: "Enter minutes (e.g. 5)",
    correctAnswer: "5",
  },
  {
    id: 3,
    text: "In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how many days would it take for the patch to cover half of the lake?",
    hint: "Enter days (e.g. 47)",
    correctAnswer: "47",
  },
];

export default CRT_QUESTIONS;
