// import fs from "fs";
// import faiss from "faiss-node";
// import { pipeline } from "@xenova/transformers";

// async function queryRAG() {

//   console.log("Retriever started");

//   console.log("Loading FAISS index...");
//   const index = faiss.IndexFlatL2.read("vector.index");

//   console.log("Loading chunks...");
//   const documents = JSON.parse(
//     fs.readFileSync("chunks.json", "utf-8")
//   );

//   console.log("Total chunks:", documents.length);

//   const embedder = await pipeline(
//     "feature-extraction",
//     "Xenova/bge-small-en-v1.5"
//   );

//   const question = "What is this document about?";

//   const output = await embedder(question, {
//     pooling: "mean",
//     normalize: true
//   });

//   const queryVector = Array.from(output.data);

//   console.log("Searching vector DB...");

//   const result = index.search(queryVector, 3);

//   console.log("Search Result:", result);

//   const context = result.labels.map((i: number) => documents[i].text);

//   console.log("Relevant Context:", context);
// }

// queryRAG();

import fs from "fs";
import faiss from "faiss-node";
import { pipeline } from "@xenova/transformers";

export async function retrieveContext(query: string) {

  console.log("Retriever started");

  console.log("Loading FAISS index...");
  const index = faiss.IndexFlatL2.read("vector.index");

  console.log("Loading chunks...");
  const documents = JSON.parse(
    fs.readFileSync("chunks.json", "utf-8")
  );

  console.log("Total chunks:", documents.length);

  const embedder = await pipeline(
    "feature-extraction",
    "Xenova/bge-small-en-v1.5"
  );

  const output = await embedder(query, {
    pooling: "mean",
    normalize: true
  });

  const queryVector = Array.from(output.data);

  console.log("Searching vector DB...");

  const result = index.search(queryVector, 3);

  const context = result.labels.map((i: number) => documents[i].text);

  return context.join("\n");
}