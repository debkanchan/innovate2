import express, { Request, Response, json } from "express";

import { answer, draft } from "./flows.js";
import { runFlow } from "@genkit-ai/flow";
import cors from "cors";

const server = express();
const PORT = 8080;

server.use(
  cors({
    origin: "*",
  }),
);
server.use(json());

server.post("/answer", async (req: Request, res: Response) => {
  try {
    let llmres = await runFlow(answer, req.body["input"]);
    res.send(llmres);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send("Oops! Something went wrong. We could not fulfill your request");
  }
});

server.post("/draft", async (req: Request, res: Response) => {
  try {
    let llmres = await runFlow(draft, req.body["input"]);
    res.send({text: llmres, references: []});
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
