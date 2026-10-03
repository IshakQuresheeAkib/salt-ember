import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const inputLogo = path.join(publicDir, "logo.webp");

if (!fs.existsSync(inputLogo)) {
  console.error("Input logo not found at:", inputLogo);
  process.exit(1);
}

// Helper to create valid multi-size ICO binary from PNG buffers
function createIco(images) {
  const count = images.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const header = Buffer.alloc(headerSize);

  // ICONDIR header
  header.writeUInt16LE(0, 0); // Reserved. Must always be 0.
  header.writeUInt16LE(1, 2); // Image type: 1 for icon (.ICO) image
  header.writeUInt16LE(count, 4); // Number of images

  const buffers = [];

  for (let i = 0; i < count; i++) {
    const { size, buffer } = images[i];
    const entryOffset = 6 + i * 16;

    header.writeUInt8(size >= 256 ? 0 : size, entryOffset); // Width
    header.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1); // Height
    header.writeUInt8(0, entryOffset + 2); // Palette colors (0 = no palette)
    header.writeUInt8(0, entryOffset + 3); // Reserved (0)
    header.writeUInt16LE(1, entryOffset + 4); // Color planes (1)
    header.writeUInt16LE(32, entryOffset + 6); // Bits per pixel (32-bit RGBA)
    header.writeUInt32LE(buffer.length, entryOffset + 8); // Size of image data in bytes
    header.writeUInt32LE(offset, entryOffset + 12); // Offset to image data

    offset += buffer.length;
    buffers.push(buffer);
  }

  return Buffer.concat([header, ...buffers]);
}

async function generateAll() {
  console.log("Generating favicons and icons from:", inputLogo);

  // Load trimmed logo buffer for perfect square centering
  const trimmedLogoBuffer = await sharp(inputLogo)
    .trim()
    .toBuffer();

  // 1. Standard PNG favicons
  const standardSizes = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "favicon-48x48.png", size: 48 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "logo.png", size: 512 },
  ];

  for (const { name, size } of standardSizes) {
    const outPath = path.join(publicDir, name);
    await sharp(trimmedLogoBuffer)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    console.log(`Generated: ${name} (${size}x${size})`);
  }

  // 2. Apple Touch Icons (180x180) with subtle padding for elegant look on iOS home screen
  const appleSizes = ["apple-touch-icon.png", "apple-touch-icon-180x180.png"];
  const appleIconBuffer = await sharp(trimmedLogoBuffer)
    .resize(180, 180, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  for (const name of appleSizes) {
    fs.writeFileSync(path.join(publicDir, name), appleIconBuffer);
    console.log(`Generated: ${name} (180x180)`);
  }

  // 3. Maskable icons: essential artwork must fit inside the centered
  // safe circle with radius 40% of the icon size, regardless of platform mask.
  const maskableConfigs = [
    { name: "icon-maskable-192.png", size: 192 },
    { name: "icon-maskable-512.png", size: 512 },
  ];

  for (const { name, size } of maskableConfigs) {
    // Inscribe the logo's square bounds in the safe circle. Reserve one pixel
    // of radial clearance for integer resize and centering rounding.
    const safeDiameter = size * 0.8;
    const innerSize = Math.floor((safeDiameter - 2) / Math.SQRT2);
    const innerBuffer = await sharp(trimmedLogoBuffer)
      .resize(innerSize, innerSize, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    const padding = Math.round((size - innerSize) / 2);

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 11, g: 34, b: 40, alpha: 1 }, // #0B2228
      },
    })
      .composite([{ input: innerBuffer, top: padding, left: padding }])
      .png({ compressionLevel: 9 })
      .toFile(path.join(publicDir, name));

    console.log(`Generated maskable icon: ${name} (${size}x${size})`);
  }

  // 4. Multi-resolution favicon.ico (contains 16x16, 32x32, 48x48)
  const icoSizes = [16, 32, 48];
  const icoImages = await Promise.all(
    icoSizes.map(async (size) => {
      const buffer = await sharp(trimmedLogoBuffer)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
      return { size, buffer };
    })
  );

  const icoBuffer = createIco(icoImages);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);
  console.log("Generated: favicon.ico (multi-resolution 16x16, 32x32, 48x48)");

  // 5. OpenGraph & Twitter Card Image (1200x630)
  const ogWidth = 1200;
  const ogHeight = 630;
  const ogLogoSize = 340;

  const ogLogoBuffer = await sharp(trimmedLogoBuffer)
    .resize(ogLogoSize, ogLogoSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const ogSvg = Buffer.from(`
    <svg width="${ogWidth}" height="${ogHeight}" viewBox="0 0 ${ogWidth} ${ogHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="emberGlow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stop-color="#E36414" stop-opacity="0.38" />
          <stop offset="50%" stop-color="#E36414" stop-opacity="0.10" />
          <stop offset="100%" stop-color="#0B2228" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E36414" stop-opacity="0.7" />
          <stop offset="50%" stop-color="#E4E4E4" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#E36414" stop-opacity="0.7" />
        </linearGradient>
      </defs>

      <!-- Warm Ember Background Glow -->
      <rect width="${ogWidth}" height="${ogHeight}" fill="url(#emberGlow)" />

      <!-- Outer decorative frame -->
      <rect x="28" y="28" width="${ogWidth - 56}" height="${ogHeight - 56}" rx="20" fill="none" stroke="url(#cardBorder)" stroke-width="2" />

      <!-- Editorial Typography -->
      <text x="600" y="475" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800" fill="#E4E4E4" letter-spacing="4">SALT &amp; EMBER</text>
      <text x="600" y="522" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600" fill="#E36414" letter-spacing="5">FLAVOUR MEETS FIRE</text>
      <text x="600" y="565" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="400" fill="#94A3B8" letter-spacing="1.5">Baruthkhana Point, East Zindabazar, Sylhet</text>
    </svg>
  `);

  await sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 4,
      background: { r: 11, g: 34, b: 40, alpha: 1 }, // #0B2228
    },
  })
    .composite([
      { input: ogSvg, top: 0, left: 0 },
      {
        input: ogLogoBuffer,
        top: 80,
        left: Math.round((ogWidth - ogLogoSize) / 2),
      },
    ])
    .png({ compressionLevel: 8 })
    .toFile(path.join(publicDir, "og-image.png"));

  console.log("Generated: og-image.png (1200x630 OpenGraph / Twitter card)");

  console.log("All favicons, icons, and social preview assets generated successfully!");
}

generateAll().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});
