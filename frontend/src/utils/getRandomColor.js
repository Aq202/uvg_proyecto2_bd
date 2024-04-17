function getLuminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    const result = v / 255;
    return result <= 0.02 ? result / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export default function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  const luminance = getLuminance(r, g, b);

  const textColor = luminance > 0.5 ? 'black' : 'white';

  const color = `rgb(${r},${g},${b})`;
  return { background: color, text: textColor };
}
