document.addEventListener('DOMContentLoaded', () => {
  (async function main() {
    const { initializeGame } = await dependsOn('Game');
    const gameElement = document.querySelector('#game');
    initializeGame({ 
      element: gameElement
    });
  })();
});
