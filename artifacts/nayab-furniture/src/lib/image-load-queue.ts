const MOBILE =
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

const MAX_CONCURRENT = MOBILE ? 3 : 6;

let active = 0;
const waiters: Array<() => void> = [];

/** Limits parallel image downloads so mobile browsers don't stall half the grid. */
export function acquireImageSlot(): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active += 1;
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    waiters.push(() => {
      active += 1;
      resolve();
    });
  });
}

export function releaseImageSlot(): void {
  active = Math.max(0, active - 1);
  const next = waiters.shift();
  if (next) next();
}
