import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

/**
 * Fetches a PDF from a given URL and extracts its text content.
 * 
 * @param fileUrl - URL of the PDF file to fetch and process
 * @returns A promise that resolves to the extracted text string
 */
export async function fetchAndExtractPdfText(fileUrl: string): Promise<string> {
  if (!fileUrl) throw new Error('No file URL provided');

  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error('Failed to fetch the PDF file');

  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const loader = new PDFLoader(new Blob([arrayBuffer]));

  const docs = await loader.load();
  return docs.map((doc) => doc.pageContent).join('\n');
}
