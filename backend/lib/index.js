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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const flows_js_1 = require("./flows.js");
const flow_1 = require("@genkit-ai/flow");
const cors_1 = __importDefault(require("cors"));
const server = (0, express_1.default)();
const PORT = 8080;
server.use((0, cors_1.default)({
    origin: "*",
}));
server.use((0, express_1.json)());
server.post("/answer", async (req, res) => {
    try {
        let llmres = await (0, flow_1.runFlow)(flows_js_1.answer, req.body["input"]);
        res.send(llmres);
    }
    catch (e) {
        console.error(e);
        res
            .status(500)
            .send("Oops! Something went wrong. We could not fulfill your request");
    }
});
server.post("/draft", async (req, res) => {
    try {
        let llmres = await (0, flow_1.runFlow)(flows_js_1.draft, req.body["input"]);
        res.send(llmres);
    }
    catch (e) {
        console.error(e);
        res
            .status(500)
            .send("Oops! Something went wrong. We could not fulfill your request");
    }
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map