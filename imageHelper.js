/**
 * Helper to normalize image paths so user-provided paths work seamlessly
 * whether they enter 'myphoto.jpg', 'assets/photos/myphoto.jpg', or '/assets/photos/myphoto.jpg'
 */
export function normalizeImagePath(src, defaultFallback = '/assets/photos/photo1.svg') {
  if (!src || typeof src !== 'string') return defaultFallback;
  const trimmed = src.trim();
  if (!trimmed) return defaultFallback;

  // External URLs or data/blob URLs
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Already an absolute path starting with /
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // If path starts with assets/
  if (trimmed.startsWith('assets/')) {
    return `/${trimmed}`;
  }

  // If just filename e.g. "photo1.jpg"
  return `/assets/photos/${trimmed}`;
}

export default normalizeImagePath;
