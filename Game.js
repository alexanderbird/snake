module.Game = (async function main() {
  function initializeGame({ element }) {
    element.innerHTML = 'Hey, Snake';
  }

  return {
    initializeGame,
  }
})();
