import { existsSync, unlinkSync } from "fs";

export async function cleanUpLocalFiles(media: any[]): Promise<void> {
  const cleanupPromises = media.map(async (image) => {
    try {
      // Check if file still exists before trying to delete
      if (existsSync(image.path)) {
        unlinkSync(image.path);
        console.log(`Successfully deleted local file: ${image.path}`);
      }
    } catch (err) {
      console.error(`Failed to delete local file ${image.path}:`, err);
      // Optionally, you could add the file to a cleanup queue for retry later
    }
  });

  await Promise.allSettled(cleanupPromises);
}
