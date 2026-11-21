// Share connection attempts so a burst of requests cannot create competing clients.
export function createConnectionRecovery({ isReady, connect, schedule = setTimeout, delay = 10000, onError = () => {} }) {
  let pending;
  let timer;
  const ensure = () => {
    if (isReady()) return Promise.resolve(true);
    if (pending) return pending;
    pending = Promise.resolve().then(connect).then(() => true).catch((error) => {
      onError(error);
      return false;
    }).finally(() => {
      pending = undefined;
      if (!isReady()) retry();
    });
    return pending;
  };
  const retry = () => {
    if (timer) return;
    timer = schedule(() => { timer = undefined; void ensure(); }, delay);
    timer?.unref?.();
  };
  return { ensure, retry };
}
