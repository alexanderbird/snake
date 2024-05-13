function dependsOn(name) {
  window.module = window.module || {}
  script = document.createElement('script');
  const path = `./${name}.js`;
  script.src = path;
  document.head.append(script);
  const retryInterval = 50;
  const maxRetryDuration = 2000;
  const maxRetry = maxRetryDuration / retryInterval;
  return new Promise((resolve, reject) => {
    let retryCount = 0;
    const interval = setInterval(() => {
      retryCount += 1;
      const toReturn = window.module[name];
      if (toReturn) {
        clearInterval(interval);
        resolve(toReturn);
      } else if (retryCount > maxRetry) {
        clearInterval(interval);
        const error = `After loading ${path}, no module named ${name} was available after ${maxRetryDuration}ms. `
          + `Did you forget to add 'module.${name} = ' in ${path}?`;
        reject(new Error(error));
      }
    }, retryInterval);
  });
}
