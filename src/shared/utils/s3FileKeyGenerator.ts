export const generateS3FileKey = (folder: string, originalFileName: string): string => {
  const timestamp = Date.now();
  const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  return `${folder}/${timestamp}/${sanitizedFileName}`;
};