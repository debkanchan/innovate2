import { generate } from "@genkit-ai/ai";
import { configureGenkit } from "@genkit-ai/core";
import { defineFlow, startFlowsServer } from "@genkit-ai/flow";
import { googleAI, geminiPro, gemini15Pro } from "@genkit-ai/googleai";
import * as z from "zod";
import "dotenv/config";
import { getFirestore } from "firebase-admin/firestore";

configureGenkit({
  plugins: [googleAI({ apiVersion: "v1beta" })],
  logLevel: "info",
  enableTracingAndMetrics: true,
});

export const answer = defineFlow(
  {
    name: "answer",
    inputSchema: z.string(),
    outputSchema: z.object({
      text: z.string(),
      references: z.array(
        z.object({
          name: z.string(),
          section: z.string(),
          url: z.string(),
        }),
      ),
    }),
  },
  async (subject) => {
    const llmResponse = await generate({
      prompt: `You are a helpful assistant to a lawyer. You specialize on Indian laws. The client wants to know ${subject}. Provide a text answer along with list of explicit and specific references to the sections of the laws. The text answer should be in details including the exceptions such that there is no room for confusion. Only use data from https://legislative.gov.in and https://indiakanoon.org.`,
      model: gemini15Pro,
      config: {
        temperature: 1,
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      },
      output: {
        format: "json",
        schema: z.object({
          text: z.string().describe("the text answer to the query"),
          references: z
            .array(
              z.object({
                name: z.string().describe("name of the law"),
                section: z
                  .string()
                  .describe("the applicable section under the law"),
                url: z.string().describe("url to the refence"),
              }),
            )
            .describe("an array of references to the laws"),
        }),
      },
    });

    return llmResponse.output() ?? { text: "", references: [] };
  },
);

export const explain = defineFlow(
  {
    name: "explain",
    inputSchema: z.object({ urls: z.array(z.string()), query: z.string() }),
    outputSchema: z.object({
      text: z.string(),
      references: z.array(
        z.object({
          name: z.string(),
          section: z.string(),
          url: z.string(),
        }),
      ),
    }),
  },
  async ({ query, urls }) => {
    const llmResponse = await generate({
      prompt: `You are a helpful assistant to a lawyer. You specialize on Indian laws. You have to explain the documents uploaded by the client. The client also wants to know ${query}. Provide an explaination along with list of explicit and specific references to the sections of the laws if applicable. The text explaination should be in details including the important points to be noted and things the client has to be careful about (if applicable) such that there is no room for confusion. Only use data from https://legislative.gov.in and https://indiakanoon.org.`,
      context: [
        {
          content: urls.map((url) => {
            return {
              media: {
                url: url,
              },
            };
          }),
        },
      ],
      model: gemini15Pro,
      config: {
        temperature: 1,
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      },
      output: {
        format: "json",
        schema: z.object({
          text: z.string().describe("the text explaination"),
          references: z
            .array(
              z.object({
                name: z.string().describe("name of the law"),
                section: z
                  .string()
                  .describe("the applicable section under the law"),
                url: z.string().describe("url to the refence"),
              }),
            )
            .describe("an array of references to the laws"),
        }),
      },
    });

    return llmResponse.output() ?? { text: "", references: [] };
  },
);

export const draft = defineFlow(
  {
    name: "draft",
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    const llmResponse = await generate({
      prompt: `You are a helpful assistant to a lawyer. You specialize on Indian laws. Your job is to draft legal documents according to what the client wants. The client wants you to draft a ${subject}. The draft should be verbose, specific and have no room for confusion. If you need to refence any law, provide explicit and specific references to the sections of the laws which you can get from https://legislative.gov.in. Draft the required document in markdown format.`,
      model: gemini15Pro,
      config: {
        temperature: 1,
      },
    });

    return llmResponse.text();
  },
);
