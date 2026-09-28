export function formatLapTime(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) return '—';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const wholeSecs = Math.floor(secs);
  const millis = Math.round((secs - wholeSecs) * 1000);

  if (mins > 0) {
    return `${mins}:${wholeSecs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
  }
  return `${wholeSecs}.${millis.toString().padStart(3, '0')}`;
}

export function formatGap(gap: number | null | undefined): string {
  if (gap == null || gap <= 0) return '—';
  return `+${gap.toFixed(3)}s`;
}

export function formatSessionDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatSessionTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function isUpcoming(isoDate: string, now = new Date()): boolean {
  return new Date(isoDate) > now;
}
