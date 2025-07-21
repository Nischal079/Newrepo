'use server';
/**
 * @fileOverview Summarizes chat history and suggests next steps for successful transactions.
 *
 * - summarizeChatSuggestSteps - A function that takes chat history as input and returns a summary and suggested next steps.
 * - SummarizeChatSuggestStepsInput - The input type for the summarizeChatSuggestSteps function.
 * - SummarizeChatSuggestStepsOutput - The return type for the summarizeChatSuggestSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeChatSuggestStepsInputSchema = z.object({
  chatHistory: z
    .string()
    .describe('The complete chat history between the user and the asset owner.'),
});
export type SummarizeChatSuggestStepsInput = z.infer<typeof SummarizeChatSuggestStepsInputSchema>;

const SummarizeChatSuggestStepsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the chat history.'),
  suggestedNextSteps: z
    .string()
    .describe(
      'A list of suggested next steps to facilitate a successful transaction.'
    ),
});
export type SummarizeChatSuggestStepsOutput = z.infer<typeof SummarizeChatSuggestStepsOutputSchema>;

export async function summarizeChatSuggestSteps(
  input: SummarizeChatSuggestStepsInput
): Promise<SummarizeChatSuggestStepsOutput> {
  return summarizeChatSuggestStepsFlow(input);
}

const summarizeChatSuggestStepsPrompt = ai.definePrompt({
  name: 'summarizeChatSuggestStepsPrompt',
  input: {schema: SummarizeChatSuggestStepsInputSchema},
  output: {schema: SummarizeChatSuggestStepsOutputSchema},
  prompt: `You are a helpful assistant that summarizes a chat history between a user and an asset owner, and suggests the next steps to facilitate a successful transaction.

Chat History:
{{{chatHistory}}}

Summary:
Suggested Next Steps:`,
});

const summarizeChatSuggestStepsFlow = ai.defineFlow(
  {
    name: 'summarizeChatSuggestStepsFlow',
    inputSchema: SummarizeChatSuggestStepsInputSchema,
    outputSchema: SummarizeChatSuggestStepsOutputSchema,
  },
  async input => {
    const {output} = await summarizeChatSuggestStepsPrompt(input);
    return output!;
  }
);
