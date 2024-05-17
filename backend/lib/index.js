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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
server.use((0, express_1.text)());
server.post("/answer", async (req, res) => {
    try {
        let llmres = await (0, flow_1.runFlow)(flows_js_1.answer, req.body);
        res.send(llmres);
    }
    catch (e) {
        console.error(e);
        res
            .status(500)
            .send("Oops! Something went wrong. We could not fulfill your request");
    }
});
server.post("/draft:stream", async (req, res) => {
    var _a, e_1, _b, _c;
    try {
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        let llmres = await (0, flow_1.streamFlow)(flows_js_1.draft, req.body);
        try {
            for (var _d = true, _e = __asyncValues(llmres.stream()), _f; _f = await _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                console.log(chunk);
                res.write(chunk);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.end();
        // res.send({text: llmres, references: []});
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
        let llmres = await (0, flow_1.runFlow)(flows_js_1.draft, req.body);
        res.send({ text: llmres, references: [] });
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