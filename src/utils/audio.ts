let audioEnabled = true;

export function setAudioEnabled(enabled: boolean): void {
  audioEnabled = enabled;
}

export function isAudioEnabled(): boolean {
  return audioEnabled;
}

export function playGraphiteStroke(): void {}
export function playPageTurn(): void {}
export function playCardTap(): void {}
export function playSuccessTone(): void {}
export function playWinCheer(): void {}
