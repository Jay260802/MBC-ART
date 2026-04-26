import sharp from "sharp";

// Flat matte gold — no shine, no gradient, no 3D
const FLAT_R = 197;
const FLAT_G = 151;
const FLAT_B = 58;

async function run() {
  const { data, info } = await sharp("public/logo.png")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buf = Buffer.from(data);

  for (let i = 0; i < buf.length; i += 4) {
    const alpha = buf[i + 3];
    if (alpha === 0) continue; // skip fully transparent pixels

    // Replace every visible pixel with the flat gold color
    // Keep alpha as-is so anti-aliased edges stay smooth
    buf[i]     = FLAT_R;
    buf[i + 1] = FLAT_G;
    buf[i + 2] = FLAT_B;
  }

  const out = await sharp(buf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    // Upscale 2× for higher resolution output
    .resize(info.width * 2, info.height * 2, { kernel: "lanczos3" })
    // Unsharp mask — sharpens edges and fine details
    .sharpen({ sigma: 1.8, m1: 1.5, m2: 0.7 })
    // Slight brightness + saturation lift for clean, balanced color
    .modulate({ brightness: 1.03, saturation: 1.15 })
    .png({ compressionLevel: 9, quality: 100 })
    .toFile("public/logo-flat.png");

  console.log(`✓ Saved public/logo-flat.png  (${out.width}×${out.height})`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
