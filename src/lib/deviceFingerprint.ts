/**
 * Simple device fingerprinting for trial tracking
 * Note: This is a basic implementation for demo purposes
 */

export async function generateDeviceFingerprint(): Promise<string> {
  const components: string[] = [];

  // Screen info
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
  
  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  
  // Language
  components.push(navigator.language);
  
  // Platform
  components.push(navigator.platform);
  
  // User agent hash
  components.push(navigator.userAgent);
  
  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Vyral fingerprint', 2, 2);
      components.push(canvas.toDataURL().slice(-50));
    }
  } catch {
    components.push('no-canvas');
  }
  
  // Hardware concurrency
  components.push(String(navigator.hardwareConcurrency || 0));
  
  // Device memory (if available)
  components.push(String((navigator as any).deviceMemory || 0));

  // Create a hash from all components
  const combined = components.join('|');
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  
  // Use SubtleCrypto for hashing
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex.slice(0, 32); // Return first 32 chars
}
