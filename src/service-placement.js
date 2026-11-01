// Exhibition placement only; no operational draft, deployment or flight model.
export function exhibitPlacement(branch, index, height, waterLevel) {
  if (branch === 'navy') {
    if (!Number.isFinite(waterLevel)) throw new TypeError('Naval exhibit needs a water level');
    return {x: -10, z: -45, bottom: waterLevel - height * .25, environment: 'water'};
  }
  return {x: index ? 10 : -10, z: -5, bottom: .05, environment: 'land'};
}
