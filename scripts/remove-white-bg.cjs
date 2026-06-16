const sharp = require("sharp");
const path = require("path");

const input = process.argv[2];
const output = process.argv[3];

async function run() {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const lowThresh = 215;
  const highThresh = 248;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const minC = Math.min(r, g, b);
    const maxC = Math.max(r, g, b);
    const isNeutral = maxC - minC < 18;

    if (isNeutral && minC > lowThresh) {
      const t = Math.min(1, Math.max(0, (minC - lowThresh) / (highThresh - lowThresh)));
      const alpha = Math.round((1 - t) * 255);
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(output);

  console.log("done", output);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
