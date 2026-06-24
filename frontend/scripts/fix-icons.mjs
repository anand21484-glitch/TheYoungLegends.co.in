import sharp from "sharp";
import { copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assets = join(__dirname, "..", "assets", "images");

async function run() {
  // Fix 1 & 2 — resize icon.png and adaptive-icon.png to exactly 512x512
  await sharp(join(assets, "icon.png"))
    .resize(512, 512, { fit: "fill" })
    .toFile(join(assets, "icon-fixed.png"));

  await sharp(join(assets, "adaptive-icon.png"))
    .resize(512, 512, { fit: "fill" })
    .toFile(join(assets, "adaptive-icon-fixed.png"));

  // Overwrite originals with fixed versions
  copyFileSync(join(assets, "icon-fixed.png"), join(assets, "icon.png"));
  copyFileSync(join(assets, "adaptive-icon-fixed.png"), join(assets, "adaptive-icon.png"));

  // Fix 3 — create splash-icon.png at 200x200 from icon.png
  await sharp(join(assets, "icon.png"))
    .resize(200, 200, { fit: "fill" })
    .toFile(join(assets, "splash-icon.png"));

  // Clean up temp files
  const { unlinkSync } = await import("fs");
  unlinkSync(join(assets, "icon-fixed.png"));
  unlinkSync(join(assets, "adaptive-icon-fixed.png"));

  // Verify
  const { default: sharpCheck } = await import("sharp");
  const icon = await sharpCheck(join(assets, "icon.png")).metadata();
  const adaptive = await sharpCheck(join(assets, "adaptive-icon.png")).metadata();
  const splash = await sharpCheck(join(assets, "splash-icon.png")).metadata();

  console.log(`icon.png:          ${icon.width}x${icon.height}`);
  console.log(`adaptive-icon.png: ${adaptive.width}x${adaptive.height}`);
  console.log(`splash-icon.png:   ${splash.width}x${splash.height}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
