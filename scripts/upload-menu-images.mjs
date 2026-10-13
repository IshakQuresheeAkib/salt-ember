import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import path from "node:path";

// Read .env manually
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...vals] = trimmed.split("=");
    process.env[key.trim()] = vals.join("=").trim();
  });
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || "salt-ember";

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Missing Cloudinary credentials in .env");
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const menuDir = path.resolve(process.cwd(), "public", "menu-images");
if (!fs.existsSync(menuDir)) {
  console.log("No public/menu-images directory found. Nothing to upload.");
  process.exit(0);
}
const files = fs.readdirSync(menuDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

console.log(`Found ${files.length} images in ${menuDir}`);

async function uploadFile(filename) {
  const filePath = path.join(menuDir, filename);
  const nameWithoutExt = path.parse(filename).name;
  
  console.log(`Uploading ${filename}...`);
  const result = await cloudinary.uploader.upload(filePath, {
    folder: uploadFolder,
    public_id: nameWithoutExt,
    overwrite: true,
    resource_type: "image",
    use_filename: true,
    unique_filename: false,
  });

  console.log(`✓ Uploaded ${filename} -> ${result.secure_url}`);
  return {
    filename,
    public_id: result.public_id,
    secure_url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

async function main() {
  const results = {};
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let retries = 3;
    while (retries > 0) {
      try {
        const res = await uploadFile(file);
        results[file] = res;
        break;
      } catch (err) {
        retries--;
        console.error(`Failed uploading ${file} (${retries} retries left):`, err.message);
        if (retries === 0) throw err;
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  const outputPath = path.resolve(process.cwd(), "scripts", "uploaded-menu-images.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`\nAll ${files.length} assets uploaded successfully! Saved to ${outputPath}`);
}

main().catch((err) => {
  console.error("Upload process failed:", err);
  process.exit(1);
});
