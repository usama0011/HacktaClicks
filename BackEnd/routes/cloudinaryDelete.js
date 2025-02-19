import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: "dovmnsimj",
  api_key: "812677675493278",
  api_secret: "iwGc-OeoVaz3dPRxo0xXwLurKhw",
});

// Function to continuously delete January 2025 images until none are left
export const deleteImagesFromJanuary = async () => {
  try {
    let totalDeleted = 0;
    let nextCursor = null;
    const startDate = new Date("2025-01-01T00:00:00Z");
    const endDate = new Date("2025-02-01T00:00:00Z");

    while (true) {
      let publicIds = [];

      // Fetch images in **ascending order** (oldest first)
      const result = await cloudinary.v2.api.resources({
        type: "upload",
        max_results: 500, // Fetch 500 images at a time
        next_cursor: nextCursor,
        direction: "asc", // Ensures January is deleted first
      });

      console.log(`Fetched Images: ${result.resources.length}`);

      // Filter images for January 2025 only
      const filteredImages = result.resources.filter((img) => {
        const uploadDate = new Date(img.created_at);
        const uploadYear = uploadDate.getUTCFullYear();
        const uploadMonth = uploadDate.getUTCMonth() + 1;

        return uploadYear === 2025 && uploadMonth === 1; // Match January 2025
      });

      console.log(`Filtered Images (January 2025): ${filteredImages.length}`);

      // Collect public IDs for deletion
      publicIds = filteredImages.map((img) => img.public_id);

      // If no more images are found, exit the loop
      if (publicIds.length === 0) {
        console.log("✅ No more January 2025 images to delete!");
        break;
      }

      // Delete images in batches of 100
      for (let i = 0; i < publicIds.length; i += 100) {
        const batch = publicIds.slice(i, i + 100);
        console.log(
          `🚀 Deleting batch ${i / 100 + 1}: ${batch.length} images...`
        );
        await cloudinary.v2.api.delete_resources(batch);
      }

      totalDeleted += publicIds.length;
      console.log(
        `✅ Deleted ${publicIds.length} images so far (Total: ${totalDeleted})`
      );

      nextCursor = result.next_cursor; // Continue fetching next batch
    }

    console.log(
      `🎉 Finished! Deleted a total of ${totalDeleted} images from January 2025.`
    );
    return { success: true, message: `Deleted ${totalDeleted} images.` };
  } catch (error) {
    console.error("❌ Error deleting images:", error);
    return { success: false, message: "Error deleting images.", error };
  }
};
