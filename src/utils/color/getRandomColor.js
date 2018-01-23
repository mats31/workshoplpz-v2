export default function getRandomColor(type) {

  const color = {
    rgb: [],
  };

  switch (type) {
    case 'rgb':
      const r = Math.floor(256 * Math.random());
      const g = Math.floor(256 * Math.random());
      const b = Math.floor(256 * Math.random());

      color.rgb.push( r, g, b );
      break;
    default:
  }

  return color;
}
