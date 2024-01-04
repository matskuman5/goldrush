export const directionToRotation = (direction: string) => {
  switch (direction) {
    case 'N':
      return 0;
    case 'NE':
      return 45;
    case 'E':
      return 90;
    case 'SE':
      return 135;
    case 'S':
      return 180;
    case 'SW':
      return 225;
    case 'W':
      return 270;
    case 'NW':
      return 315;
  }
};

export const intToBinaryString = (n: number) => {
  return n.toString(2).padStart(4, '0');
};

export const openDirections = (bitString: string) => {
  const directions: string[] = [];

  if (bitString.charAt(0) === '0') {
    directions.push('N');
  }
  if (bitString.charAt(1) === '0') {
    directions.push('E');
  }
  if (bitString.charAt(2) === '0') {
    directions.push('S');
  }
  if (bitString.charAt(3) === '0') {
    directions.push('W');
  }

  return directions;
};
