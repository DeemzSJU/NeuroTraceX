/**
 * REI-20 Question Items (Shortened from Pacini & Epstein, 1999)
 * 20 items rated on a 5-point Likert scale (1 = Definitely Not True, 5 = Definitely True)
 * Perfectly balanced with 5 items per subscale (RA, RE, EA, EE).
 */

export const REI_QUESTIONS = [
  { id: 1, text: "I have a logical mind." }, // RA
  { id: 2, text: "I prefer complex problems to simple problems." }, // RE
  { id: 3, text: "I believe in trusting my hunches." }, // EA
  { id: 4, text: "I am not a very analytical thinker." }, // RA (Reversed)
  { id: 5, text: "I trust my initial feelings about people." }, // EA
  { id: 6, text: "I try to avoid situations that require thinking in depth about something." }, // RE (Reversed)
  { id: 7, text: "When it comes to trusting people, I can usually rely on my gut feelings." }, // EE
  { id: 8, text: "I don't like situations in which I have to rely on intuition." }, // EE (Reversed)
  { id: 9, text: "I don't enjoy solving problems that require hard thinking." }, // RE (Reversed)
  { id: 10, text: "I think it is foolish to make important decisions based on feelings." }, // EE (Reversed)
  { id: 11, text: "I am much better at figuring things out logically than most people." }, // RA
  { id: 12, text: "I suspect my gut feelings are often wrong." }, // EE (Reversed)
  { id: 13, text: "I rely on my intuitive impressions." }, // EA
  { id: 14, text: "I enjoy intellectual challenges." }, // RE
  { id: 15, text: "I like to rely on my intuitive impressions." }, // EE
  { id: 16, text: "I am not very good at solving problems that require careful logical analysis." }, // RA (Reversed)
  { id: 17, text: "Knowing that I am logic-driven gives me confidence." }, // RA
  { id: 18, text: "Thinking hard for long periods is painful for me." }, // RE (Reversed)
  { id: 19, text: "I am poor at intuitive reasoning." }, // EA (Reversed)
  { id: 20, text: "I don't have a good sense of intuition." } // EA (Reversed)
];

export default REI_QUESTIONS;
