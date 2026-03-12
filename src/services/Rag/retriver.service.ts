import { pipeline } from "@xenova/transformers";
import faiss from "faiss-node";
import fs from "fs";

let embedder: any;
let index: any;
let documents: any;

const initializeRAG = async () => {
  embedder = await pipeline("feature-extraction", "Xenova/bge-small-en-v1.5");
  // load FAISS index
  index = faiss.IndexFlatL2.read("vector.index");
  // stored document chunks
  documents = JSON.parse(fs.readFileSync("chunks.json", "utf-8"));
};

(async () => {
  await initializeRAG();
})();

export const retrieveContext = async (query: string) => {
  // convert query → embedding
  const output = await embedder(query, {
    pooling: "mean",
    normalize: true,
  });

  const queryVector = Float32Array.from(output.data);

  // vector similarity search
  const result = index.search(queryVector, 3);

  const retrievedDocs = result.labels.map((i: number) => documents[i]);

  return retrievedDocs.join("\n");
};