import { generate } from "@genkit-ai/ai";
import { configureGenkit } from "@genkit-ai/core";
import { defineFlow, startFlowsServer } from "@genkit-ai/flow";
import { googleAI, geminiPro, gemini15Pro } from "@genkit-ai/googleai";
import * as z from "zod";

configureGenkit({
  plugins: [googleAI()],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

export const lawFlow = defineFlow(
  {
    name: "lawFlow",
    inputSchema: z.string(),
    outputSchema: z.object({
      text: z.string(),
      references: z.array(
        z.object({
          name: z.string(),
          section: z.string(),
          url: z.string()
        })
      ),
    }),
  },
  async (subject) => {
    const llmResponse = await generate({
      prompt: `You are a helpful assistant to a lawyer. You specialize on Indian laws. The client wants to know ${subject}. Provide a text answer along with list of explicit and specific references to the sections of the laws. Search for references only from https://indiankanoon.org. The text answer should be in details including the exceptions such that there is no room for confusion.`,
      model: geminiPro,
      config: {
        temperature: 1,
      },
      output: {
        format: "json",
        schema: z.object({
          text: z.string().describe("the text answer to the query"),
          references: z.array(
            z.object({
              name: z.string().describe("name of the law"),
              section: z.string().describe("the applicable section under the law"),
              url: z.string().describe("url to the refence"),
            })
          ).describe("an array of references to the laws"),
        }),
      },
    });

    return llmResponse.output() ?? {"text": "", references: []};
  },
);

startFlowsServer();

