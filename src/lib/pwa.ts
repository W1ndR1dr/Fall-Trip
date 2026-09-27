// Service worker: precaches the whole build (see vite.config.ts). When a new
// version is deployed, `needRefresh` flips and the UI offers a reload.
import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePwa() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      // Check for a new version hourly while the app stays open.
      if (reg) setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
    },
  });
  return {
    needRefresh,
    offlineReady,
    update: () => updateServiceWorker(true),
    dismiss: () => {
      setNeedRefresh(false);
      setOfflineReady(false);
    },
  };
}
