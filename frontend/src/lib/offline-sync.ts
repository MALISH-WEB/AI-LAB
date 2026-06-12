export interface SyncItem {
  id: string;
  route: string;
  payload: Record<string, unknown>;
  method: 'POST' | 'PATCH';
  createdAt: number;
}

const DB_NAME = 'ai-lab-offline';
const STORE_NAME = 'sync-queue';

export const registerServiceWorker = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  await navigator.serviceWorker.register('/sw.js');
};

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const waitForTransaction = (tx: IDBTransaction): Promise<void> =>
  new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });

export const enqueueSync = async (item: SyncItem): Promise<void> => {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(item);
  await waitForTransaction(tx);
};

export const pullSyncQueue = async (): Promise<SyncItem[]> => {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();

  return await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as SyncItem[]);
    request.onerror = () => reject(request.error);
  });
};

export const clearSyncItem = async (id: string): Promise<void> => {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(id);
  await waitForTransaction(tx);
};
