import { estimateHoneyOriginalGravity } from '@meadstep/core';

export function checkCoreAvailability(): 'available' {
  estimateHoneyOriginalGravity({ honeyKg: 1, volumeLiters: 5 });
  return 'available';
}
