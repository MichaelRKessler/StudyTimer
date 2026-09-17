/**
 * Format total seconds into mm:ss or hh:mm:ss
 */
export function formatTime(totalSeconds: number): string {
  const safeSec = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSec / 3600);
  const minutes = Math.floor((safeSec % 3600) / 60);
  const seconds = safeSec % 60;

  const paddedM = String(minutes).padStart(2, '0');
  const paddedS = String(seconds).padStart(2, '0');

  if (hours > 0) {
    const paddedH = String(hours).padStart(2, '0');
    return `${paddedH}:${paddedM}:${paddedS}`;
  }
  return `${paddedM}:${paddedS}`;
}

/**
 * Format duration into human readable format, e.g. '1h 15m' or '25m'
 */
export function formatDurationHuman(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  if (mins > 0) {
    return `${mins}m`;
  }
  return `${secs}s`;
}

/**
 * Format timestamp into friendly date/time
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  
  const isToday = date.toDateString() === today.toDateString();
  
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) {
    return `Today at ${timeStr}`;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${timeStr}`;
  }

  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeStr}`;
}

