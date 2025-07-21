// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Provides emoji recommendations to enhance chat interactions.
 *
 * - suggestEmojiAction - A function that suggests relevant emojis for a given chat message.
 * - SuggestEmojiActionInput - The input type for the suggestEmojiAction function.
 * - SuggestEmojiActionOutput - The return type for the suggestEmojiAction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEmojiActionInputSchema = z.object({
  message: z.string().describe('The chat message to suggest emojis for.'),
});
export type SuggestEmojiActionInput = z.infer<typeof SuggestEmojiActionInputSchema>;

const SuggestEmojiActionOutputSchema = z.object({
  emojis: z.array(z.string()).describe('An array of suggested emojis for the message.'),
});
export type SuggestEmojiActionOutput = z.infer<typeof SuggestEmojiActionOutputSchema>;

export async function suggestEmojiAction(input: SuggestEmojiActionInput): Promise<SuggestEmojiActionOutput> {
  return suggestEmojiActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEmojiActionPrompt',
  input: {schema: SuggestEmojiActionInputSchema},
  output: {schema: SuggestEmojiActionOutputSchema},
  prompt: `You are an AI assistant that suggests emojis for chat messages.
  Given the following chat message, suggest up to 5 relevant emojis to add emotion and context to the message.
  Return the emojis as an array of strings.
  Message: {{{message}}}
  Emojis:`, //Fixed the prompt
});

const suggestEmojiActionFlow = ai.defineFlow(
  {
    name: 'suggestEmojiActionFlow',
    inputSchema: SuggestEmojiActionInputSchema,
    outputSchema: SuggestEmojiActionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
