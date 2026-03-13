import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { pipeline } from "@xenova/transformers";
import faiss from "faiss-node";
//const pdfParse = require("pdf-parse").default;

async function ingest() {

  const filePath = path.join(process.cwd(), "Document_PDF", "data.pdf");

  const dataBuffer = fs.readFileSync(filePath);

  const data = await (pdfParse as any)(dataBuffer);
  const text = data.text;

  // 2. Chunk text
  const chunkSize = 500;
  const chunks = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  // 3. Load embedding model
  const embedder = await pipeline(
    "feature-extraction",
    "Xenova/bge-small-en-v1.5"
  );

  const embeddings = [];

  for (const chunk of chunks) {
    const output = await embedder(chunk, {
      pooling: "mean",
      normalize: true,
    });

    embeddings.push({
      text: chunk,
      vector: Array.from(output.data)
    });
  }

  // 4. Create FAISS index
  const dimension = embeddings[0].vector.length;

  const index = new faiss.IndexFlatL2(dimension);

  const vectors = embeddings.map(e => e.vector);

  const flatVectors = vectors.reduce((acc: number[], v) => acc.concat(v), []);

  index.add(flatVectors);

  // 5. Save vector index
  index.write("vector.index");

  fs.writeFileSync("chunks.json", JSON.stringify(embeddings));

  console.log("Documents indexed successfully");
}

ingest();