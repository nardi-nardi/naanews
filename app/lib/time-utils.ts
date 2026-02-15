/**
 * Convert Unix timestamp to relative time string in Indonesian
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string (e.g., "2 jam lalu", "3 hari lalu")
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return "Baru saja";
  } else if (minutes < 60) {
    return `${minutes} menit lalu`;
  } else if (hours < 24) {
    return `${hours} jam lalu`;
  } else if (days < 7) {
    return `${days} hari lalu`;
  } else if (weeks < 4) {
    return `${weeks} minggu lalu`;
  } else if (months < 12) {
    return `${months} bulan lalu`;
  } else {
    return `${years} tahun lalu`;
  }
}

/**
 * Format timestamp to readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string (e.g., "13 Feb 2026, 14:30")
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}
