import { generate } from "@genkit-ai/ai";
import { configureGenkit } from "@genkit-ai/core";
import { defineFlow, startFlowsServer } from "@genkit-ai/flow";
import { googleAI, geminiPro, gemini15Pro } from "@genkit-ai/googleai";
import * as z from "zod";
import "dotenv/config"

configureGenkit({
  plugins: [googleAI({ apiVersion: 'v1beta' })],
  logLevel: "info",
  enableTracingAndMetrics: true,
});

export const lawFlow = defineFlow(
  {
    name: "LawFlow",
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
      prompt: `You are a helpful assistant to a lawyer. You specialize on Indian laws. The client wants to know ${subject}. Provide a text answer along with list of explicit and specific references to the sections of the laws. The text answer should be in details including the exceptions such that there is no room for confusion. Only use data from https://legislative.gov.in and https://indiakanoon.org.`,
      model: gemini15Pro,
      config: {
        temperature: 1,
        safetySettings: [{
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE"
        }],
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
