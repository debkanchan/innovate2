"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.draft = exports.explain = exports.answer = void 0;
const ai_1 = require("@genkit-ai/ai");
const core_1 = require("@genkit-ai/core");
const flow_1 = require("@genkit-ai/flow");
const googleai_1 = require("@genkit-ai/googleai");
const z = __importStar(require("zod"));
require("dotenv/config");
(0, core_1.configureGenkit)({
    plugins: [(0, googleai_1.googleAI)({ apiVersion: "v1beta" })],
    logLevel: "info",
    enableTracingAndMetrics: true,
});
exports.answer = (0, flow_1.defineFlow)({
    name: "answer",
    inputSchema: z.string(),
    outputSchema: z.object({
        text: z.string(),
        references: z.array(z.object({
            name: z.string(),
            section: z.string(),
            url: z.string(),
        })),
    }),
}, async (subject) => {
    var _a;
    const llmResponse = await (0, ai_1.generate)({
        prompt: `You are a helpful assistant to a lawyer. You specialize on Indian laws. The client wants to know "${subject}". Provide a text answer along with list of explicit and specific references to the sections of the laws. The text answer should be in details including the exceptions such that there is no room for confusion. Only use data from https://legislative.gov.in and https://indiakanoon.org. The text explaination should be in Markdown format. The following applies for text answer only and not the references. Append the string "&nbsp;&nbsp;&nbsp;&nbsp;" in front of any word to add indentation. For example, if you want to add 1 indentation to a paragraph then use 2 "&nbsp;&nbsp;&nbsp;&nbsp;". Don't add indentation to headings or sections. Add 1 indentation to a subheadings or sub-sections and it's body. If you are starting a paragraph right after another text paragraph add 2 indentation. Always add two return character when adding a new paragraph.`,
        model: googleai_1.gemini15Pro,
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
                    .array(z.object({
                    name: z.string().describe("name of the law"),
                    section: z
                        .string()
                        .describe("the applicable section under the law"),
                    url: z.string().describe("url to the refence"),
                }))
                    .describe("an array of references to the laws"),
            }),
        },
    });
    return (_a = llmResponse.output()) !== null && _a !== void 0 ? _a : { text: "", references: [] };
});
exports.explain = (0, flow_1.defineFlow)({
    name: "explain",
    inputSchema: z.object({ urls: z.array(z.string()), query: z.string() }),
    outputSchema: z.object({
        text: z.string(),
        references: z.array(z.object({
            name: z.string(),
            section: z.string(),
            url: z.string(),
        })),
    }),
}, async ({ query, urls }) => {
    var _a;
    const llmResponse = await (0, ai_1.generate)({
        prompt: `You are a helpful assistant to a lawyer. You specialize on Indian laws. You have to explain the documents uploaded by the client. The client also wants to know ${query}. Provide an explaination along with list of explicit and specific references to the sections of the laws if applicable. The text explaination should be in details including the important points to be noted and things the client has to be careful about (if applicable) such that there is no room for confusion. Only use data from https://legislative.gov.in and https://indiakanoon.org. The text explaination should be in Markdown format. Append the string "&nbsp;&nbsp;&nbsp;&nbsp;" in front of any word to add indentation. For example, if you want to add 1 indentation to a paragraph then use 2 "&nbsp;&nbsp;&nbsp;&nbsp;". Don't add indentation to headings or sections. Add 1 indentation to a subheadings or sub-sections and it's body. If you are starting a paragraph right after another text paragraph add 2 indentation. Always add two return character when adding a new paragraph.`,
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
        model: googleai_1.gemini15Pro,
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
                text: z.string().describe("the text explaination in markdown format"),
                references: z
                    .array(z.object({
                    name: z.string().describe("name of the law"),
                    section: z
                        .string()
                        .describe("the applicable section under the law"),
                    url: z.string().describe("url to the refence"),
                }))
                    .describe("an array of references to the laws"),
            }),
        },
    });
    return (_a = llmResponse.output()) !== null && _a !== void 0 ? _a : { text: "", references: [] };
});
exports.draft = (0, flow_1.defineFlow)({
    name: "draft",
    inputSchema: z.string(),
    outputSchema: z.string(),
}, async (subject) => {
    const llmResponse = await (0, ai_1.generate)({
        prompt: `You are a helpful assistant to a lawyer. You specialize on Indian laws. Your job is to draft legal documents according to what the client wants. The client wants you to draft a ${subject}. The draft should be verbose, specific and have no room for confusion. If you need to refence any law, provide explicit and specific references to the sections of the laws which you can get from https://legislative.gov.in. Draft the required document in markdown format.`,
        model: googleai_1.gemini15Pro,
        config: {
            temperature: 1,
        },
    });
    return llmResponse.text();
});
//# sourceMappingURL=flows.js.map