import sharp from "sharp";
import { mkdirSync } from "fs";

async function run() {
  mkdirSync("public", { recursive: true });

  const { data, info } = await sharp("logo.png")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buf = Buffer.from(data);

  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];

    const brightness = Math.max(r, g, b);
    // Gold pixels have a strong warm colour cast (R >> B).
    // Pure black background has no such cast — safe to erase.
    const isGold = r - b > 25;

    if (!isGold && brightness < 30) {
      buf[i + 3] = 0; // fully transparent
    } else if (!isGold && brightness < 80) {
      // Smooth anti-aliased edge
      buf[i + 3] = Math.round(((brightness - 30) / 50) * 255);
    }
    // else keep fully opaque
  }

  const out = await sharp(buf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim() // remove transparent edges after bg removal
    .png({ compressionLevel: 9 })
    .toFile("public/logo.png");

  console.log(`✓ Saved public/logo.png  (${out.width}×${out.height})`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
