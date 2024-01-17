const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // Replace with your database client
const path = require("path");
async function exportBookmarks() {
  try {
    const bookmarks = await prisma.Company.findMany(); // Fetch bookmarks from database
    fs.writeFileSync("bookmarks.json", JSON.stringify(bookmarks, null, 2)); // Write bookmarks to bookmarks.json file
    const sourceFilePath = path.join(__dirname, "bookmarks.json");
    const destinationFilePath = path.join(
      __dirname,
      "../../Job Board Public/public_job_board/bookmarks.json"
    );
    fs.copyFileSync(sourceFilePath, destinationFilePath);
    console.log("Export successful");
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

exportBookmarks();
