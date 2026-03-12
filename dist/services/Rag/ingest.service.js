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
const llamaindex_1 = require("llamaindex");
const readers_1 = require("@llamaindex/readers");
const transformers_1 = require("@xenova/transformers");
const faiss_node_1 = __importDefault(require("faiss-node"));
const fs_1 = __importDefault(require("fs"));
function ingestDocuments() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Load PDF documents
        const docs = yield new readers_1.SimpleDirectoryReader().loadData({
            directoryPath: "./data/documents",
        });
        // 2. Chunk the documents
        const splitter = new llamaindex_1.SentenceSplitter({
            chunkSize: 512,
            chunkOverlap: 50,
        });
        const chunks = splitter.getNodesFromDocuments(docs);
        // 3. Load embedding model (Xenova/bge-small-en-v1.5)
        const embedder = yield (0, transformers_1.pipeline)("feature-extraction", "Xenova/bge-small-en-v1.5");
        // 4. Generate embeddings
        const embeddings = [];
        for (const chunk of chunks) {
            const output = yield embedder(chunk.getContent(), {
                pooling: "mean",
                normalize: true,
            });
            embeddings.push({
                text: chunk.getContent(),
                vector: Array.from(output.data),
            });
        }
        // 5. Store embeddings in FAISS vector database
        const dimension = embeddings[0].vector.length;
        const index = new faiss_node_1.default.IndexFlatL2(dimension);
        const vectors = embeddings.map((e) => Float32Array.from(e.vector));
        const flatVectors = new Float32Array(vectors.reduce((acc, v) => acc.concat(Array.from(v)), []));
        index.add(Array.from(flatVectors));
        // index.add(flatVectors);
        fs_1.default.writeFileSync("chunks.json", JSON.stringify(embeddings));
        // Save index to disk
        index.write("vector.index");
        console.log("Documents indexed successfully");
    });
}
ingestDocuments().catch(console.error);
