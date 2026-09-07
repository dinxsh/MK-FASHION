const LOCAL_API_BASE_URL = 'http://localhost:4000/api/v1';

function isLocalHost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

function shouldUseLocalFallback() {
  if (typeof window === 'undefined') return process.env.NODE_ENV !== 'production';
  return isLocalHost(window.location.hostname);
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '');
}

export function getApiBaseUrl() {
  const configuredApiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_SANITY_STUDIO_API_URL ||
    process.env.SANITY_STUDIO_API_URL ||
    '';

  if (configuredApiUrl) {
    const normalized = normalizeBaseUrl(configuredApiUrl);
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && normalized.startsWith('http://')) {
      throw new Error('Insecure API URL: use an HTTPS backend URL when the Studio/app is served over HTTPS.');
    }
    return normalized;
  }

  if (shouldUseLocalFallback()) return LOCAL_API_BASE_URL;

  throw new Error(
    'Missing API URL configuration. Set NEXT_PUBLIC_API_BASE_URL (or SANITY_STUDIO_API_URL for Studio builds) to your backend URL.',
  );
}
