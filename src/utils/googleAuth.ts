export function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Sign-In')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.body.appendChild(script);
  });
}

export function initializeGoogleAuth(
  clientId: string,
  onCredential: (credential: string) => void
) {
  window.google?.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => onCredential(response.credential),
    use_fedcm_for_prompt: true,
    auto_select: false,
  });
}

export function mountHiddenGoogleButton(
  clientId: string,
  element: HTMLElement,
  onCredential: (credential: string) => void
) {
  initializeGoogleAuth(clientId, onCredential);

  element.innerHTML = '';
  element.style.position = 'absolute';
  element.style.width = '0';
  element.style.height = '0';
  element.style.overflow = 'hidden';
  element.style.opacity = '0';
  element.style.pointerEvents = 'none';

  window.google?.accounts.id.renderButton(element, {
    theme: 'outline',
    size: 'large',
    text: 'continue_with',
    width: 320,
    shape: 'rectangular',
  });
}

export function triggerGoogleSignIn(container: HTMLElement | null) {
  if (!container) return;
  const button = container.querySelector('[role="button"]') as HTMLElement | null;
  button?.click();
}
