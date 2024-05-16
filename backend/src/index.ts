import express, { Request, Response, json } from "express";

import { answer, draft } from "./flows.js";
import { runFlow } from "@genkit-ai/flow";
import cors from "cors";

const server = express();
const PORT = 8080;

server.use(cors({
  origin: "*",
}))
server.use(json())

// server.get("/answer/:id", async (req: Request, res: Response) => {
//   const doc = await getFirestore()
//     .collection("answer")
//     .doc(req.params["id"])
//     .get();

//   const data = doc.data() ?? {};
//   res.send(data);
// });

server.post("/answer", async (req: Request, res: Response) => {
  let llmres = await runFlow(answer, req.body["input"]);
  res.send(llmres);
});

server.post("/draft", async (req: Request, res: Response) => {
  let llmres = await runFlow(draft, req.body["input"]);
  res.send(llmres);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
