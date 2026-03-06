import * as llamaIndex from "llamaindex";
const { SimpleDirectoryReader, SentenceSplitter } = llamaIndex as any;
//import { SimpleDirectoryReader, SentenceSplitter } from "llamaindex";
import { pipeline } from "@xenova/transformers";
import faiss from "faiss-node";

async function ingestDocuments() {
  // 1. Load PDF documents
  const docs = await new SimpleDirectoryReader().loadData({
    directoryPath: "./data/documents",
  });

  // 2. Chunk the documents
  const splitter = new SentenceSplitter({
    chunkSize: 512,
    chunkOverlap: 50,
  });

  const chunks = splitter.getNodesFromDocuments(docs);

  // 3. Load embedding model (bge-large-en)
  const embedder = await pipeline("feature-extraction", "BAAI/bge-large-en");

  // 4. Generate embeddings
  const embeddings = [];

  for (const chunk of chunks) {
    const output = await embedder(chunk.getContent(), {
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
  const index = new faiss.IndexFlatL2(dimension);

  const vectors = embeddings.map((e) => Float32Array.from(e.vector));
  const flatVectors = new Float32Array(vectors.reduce((acc, v) => acc.concat(Array.from(v)), [] as number[]));
  index.add(Array.from(flatVectors));

  // Save index to disk
  index.write("vector.index");

  console.log("Documents indexed successfully");
}

ingestDocuments().catch(console.error);