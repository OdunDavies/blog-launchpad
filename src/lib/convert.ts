export function convertWeightToKg(weight: number, unit: 'kg' | 'lbs'): number {
  return unit === 'lbs' ? weight * 0.453592 : weight;
}

export function convertHeightToCm(height: number, unit: 'cm' | 'ft', inches?: number): number {
  if (unit === 'ft') {
    const totalInches = (height * 12) + (inches || 0);
    return totalInches * 2.54;
  }
  return height;
}
