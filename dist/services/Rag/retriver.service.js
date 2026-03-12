"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveContext = void 0;
const transformers_1 = require("@xenova/transformers");
const faiss_node_1 = __importDefault(require("faiss-node"));
const fs_1 = __importDefault(require("fs"));
let embedder;
let index;
let documents;
const initializeRAG = () => __awaiter(void 0, void 0, void 0, function* () {
    embedder = yield (0, transformers_1.pipeline)("feature-extraction", "Xenova/bge-small-en-v1.5");
    // load FAISS index
    index = faiss_node_1.default.IndexFlatL2.read("vector.index");
    // stored document chunks
    documents = JSON.parse(fs_1.default.readFileSync("chunks.json", "utf-8"));
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeRAG();
}))();
const retrieveContext = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // convert query → embedding
    const output = yield embedder(query, {
        pooling: "mean",
        normalize: true,
    });
    const queryVector = Float32Array.from(output.data);
    // vector similarity search
    const result = index.search(queryVector, 3);
    const retrievedDocs = result.labels.map((i) => documents[i]);
    return retrievedDocs.join("\n");
});
exports.retrieveContext = retrieveContext;
