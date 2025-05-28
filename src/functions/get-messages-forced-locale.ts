import path from 'path';
import fs from 'fs/promises';

export async function getMessagesByLocale(locale: string) {
  try {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch {
    return {};
  }
}
