startGame();

// Functions for game
function startGame() {
  const bestBirds = selectBestBirds();
  stopGame();
  addPipes(3);
  for (let i = 0; i < population; i++) {
    const radius = Math.min(canvas.height, canvas.width) * birdSize / 100;
    const initX = canvas.width / 9;
    const h = canvas.height / 3;
    const initY = random(h, canvas.height - h);
    if (bestBirds.length < 1) {
      addBird(initX, initY, radius);
      continue;
    }
    // Giving last surviver bird higher change to reproduce
    const arr = [];
    bestBirds.forEach((b, i) => {
      const len = bestBirds.length;
      const t = Math.floor(len / (i + 1));
      for (let j = 0; j < t; j++)
        arr.push(b);
    });
    const bird = selectRandom(arr);
    const newBird = addBird(initX, initY, radius, bird);
    if (Math.random() < mutationRate)
      newBird.brain.mutate(val => val + randomGaussian() * 0.5);
    else
      newBird.color = bird.color;
  }
  loop(main, 1000);
}

function stopGame() {
  stopLoop();
  removeBird();
  removePipe();
  rander();
}

// Game controller functional - main
function main() {
  for (const pipe of pipes)
    pipe.update(-pipeSpeed);
  for (const bird of birds) {
    bird.update(gravity);
    highScore(bird.score);
    // bird.updateScore(pipes);
  }
  rander();
  // New pipe if a pipe goes out of rander
  const [lastPipe] = pipes.slice(-1);
  const [lastPipeX] = lastPipe.getInfoArray();
  const [firstPipe] = pipes;
  const [firstPipeX, _, firstPipeW] = firstPipe.getInfoArray();
  if (firstPipeX + firstPipeW < 0) {
    removePipe(0);
    addPipes(1);
  }
  // Predict if to jump or not
  for (const bird of birds) {
    const prediction = bird.think(pipes);
    // console.log(prediction);
    if (prediction)
      bird.jump();
    bird.updateScore(pipes, prediction);
    bird.train(pipes);
  }
  // Check if bird died
  for (const bird of birds) {
    for (const pipe of pipes) {
      if (checkCollision(bird, pipe))
        bird.kill();
      const [x, y] = bird.getInfoArray();
      if (y < 0 || y > canvas.height)
        bird.kill();
    }
  }
  // Check if all birds died
  const birdsAliveCount = birds.filter(b => b.isAlive()).length;
  birdsAlive(birdsAliveCount);
  if (birdsAliveCount < 1) {
    nextGen();
    startGame();
  }
}

// Neuro evolution - selection
function selectBestBirds() {
  const selected = birds.map(b => b).sort((a, b) => b.score - a.score).slice(0, Math.floor(birds.length * selectionRate));
  return selected;
}