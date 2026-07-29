const SDK_SCRIPT_ID = 'facebook-jssdk';
const SDK_URL = 'https://connect.facebook.net/en_US/sdk.js';

let sdkPromise: Promise<void> | null = null;

function initSdk(appId: string, graphApiVersion: string): void {
  window.FB?.init({
    appId,
    cookie: true,
    xfbml: true,
    version: graphApiVersion,
  });
}

function waitForFacebookSdk(timeoutMs = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const check = () => {
      if (window.FB) {
        resolve();
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('Facebook SDK load timeout'));
        return;
      }

      window.setTimeout(check, 50);
    };

    check();
  });
}

export function loadFacebookSdk(appId: string, graphApiVersion: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Facebook SDK requires a browser environment'));
  }

  if (window.FB) {
    initSdk(appId, graphApiVersion);
    return Promise.resolve();
  }

  if (!sdkPromise) {
    sdkPromise = new Promise<void>((resolve, reject) => {
      const finish = () => {
        waitForFacebookSdk()
          .then(() => {
            initSdk(appId, graphApiVersion);
            resolve();
          })
          .catch((error) => {
            sdkPromise = null;
            reject(error);
          });
      };

      window.fbAsyncInit = finish;

      if (!document.getElementById(SDK_SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = SDK_SCRIPT_ID;
        script.src = SDK_URL;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          sdkPromise = null;
          reject(new Error('Failed to load Facebook SDK'));
        };
        document.body.appendChild(script);
      } else {
        finish();
      }
    });
  }

  return sdkPromise.then(() => {
    initSdk(appId, graphApiVersion);
  });
}
