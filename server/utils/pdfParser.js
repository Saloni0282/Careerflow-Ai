import { PDFParse } from 'pdf-parse';

export const parseResumePdf = async (fileBuffer) => {
  let parser;

  try {
    parser = new PDFParse({ data: fileBuffer });
    const parsed = await parser.getText();
    return String(parsed.text || '').replace(/\s+/g, ' ').trim();
  } catch (error) {
    const parseError = new Error('Unable to read text from the uploaded PDF resume.');
    parseError.statusCode = 400;
    parseError.context = 'AI Cover Letter Error';
    parseError.isOperational = true;
    parseError.cause = error;
    throw parseError;
  } finally {
    await parser?.destroy?.();
  }
};
