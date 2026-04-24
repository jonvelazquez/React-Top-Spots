console.log(">>> resize.js is running");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

console.log("Script started. Reading image-source...");

const inputDir = "./image-source";
const outputDir = "./public/images";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file => {
    console.log("Found file:", file);
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  sharp(inputPath)
    .resize(800, 450, {
      fit: sharp.fit.cover,   // smart-crop style
      position: sharp.strategy.attention // crop around subject
    })
    .toFile(outputPath)
    .then(() => console.log(`Processed: ${file}`))
    .catch(err => console.error(`Error processing ${file}:`, err));
});
