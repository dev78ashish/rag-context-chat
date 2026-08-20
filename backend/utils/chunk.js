export const chunkText = (text, chunkSize = 200, overlap = 100) => {
  if (!text || !text.trim()) {
    return [];
  }

  if (overlap >= chunkSize) {
    throw new Error("Overlap must be smaller than chunk size");
  }

  const words = text.trim().split(/\s+/);
  const chunks = [];

  const step = chunkSize - overlap;

  for (let i = 0; i < words.length; i += step) {
    const chunk = words.slice(i, i + chunkSize).join(" ");

    if (chunk) {
      chunks.push(chunk);
    }
  }

  return chunks;
}