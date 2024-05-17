import express, { Request, Response, json, text } from "express";

import { answer, draft } from "./flows.js";
import { runFlow, streamFlow } from "@genkit-ai/flow";
import cors from "cors";

const server = express();
const PORT = 8080;

server.use(
  cors({
    origin: "*",
  }),
);
server.use(text());

server.post("/answer", async (req: Request, res: Response) => {
  try {
    let llmres = await runFlow(answer, req.body);
    res.send(llmres);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send("Oops! Something went wrong. We could not fulfill your request");
  }
});

server.post("/draft:stream", async (req: Request, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    let llmres = await streamFlow(draft, req.body);
    for await (const chunk of llmres.stream()) {
      console.log(chunk as string);
      res.write(chunk as string);
    }
    res.end();
    // res.send({text: llmres, references: []});
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send("Oops! Something went wrong. We could not fulfill your request");
  }
});

server.post("/draft", async (req: Request, res: Response) => {
  try {
    let llmres = await runFlow(draft, req.body);
    res.send({ text: llmres, references: [] });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send("Oops! Something went wrong. We could not fulfill your request");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
