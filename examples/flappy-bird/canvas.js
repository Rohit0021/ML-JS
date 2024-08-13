const canvas = document.querySelector("#screen");

canvas.height = window.innerHeight / 2;
canvas.width = window.innerWidth;

const ctx = canvas.getContext("2d");
const loops = [];
const pipes = [];
const birds = [];

const pipeDistance = canvas.height * pipeDistanceAlpha;
rander();

// Functions to show high score and generation

let highestScore = 0;

function highScore(score) {
  if (score > highestScore) {
    highestScore = score;
    document.querySelector("#high-score").innerText = "HIGH SCORE: " + highestScore;
  }
}

let generation = 0;

function nextGen() {
  generation++;
  document.querySelector("#gen").innerText = "Generation: " + generation;
}

function birdsAlive(count) {
  document.querySelector("#count").innerText = "Birds Alive: " + count;
}

// Functions for controlling over canvas
function clearScreen() {
  ctx.reset();
  ctx.fillStyle = bgColor;
  const alpha = 25;
  ctx.fillRect(-alpha, -alpha, canvas.height + alpha, canvas.width + alpha);
}

function rander() {
  clearScreen();
  pipes.forEach(p => p.draw());
  birds.filter(b => b.isAlive()).forEach(b => b.draw());
}

// Functions for looping 
async function loop(fn, speed = 1) {
  fn();
  const thisLoop = { active: true };
  loops.push(thisLoop);
  const run = () => {
    fn();
    if (thisLoop.active)
      requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

function stopLoop() {
  if (loops.length < 1)
    return;
  const [thisLoop] = loops.splice(0, 1);
  thisLoop.active = false;
}

// Functions for adding and removing pipes and birds
function addPipe(x, y, width, gap) {
  const pipe = new Pipe({
    x,
    y,
    width,
    gap,
    canvas,
    ctx,
    bgColor: bgColor,
    color: pipeColor,
  });
  pipes.push(pipe);
  rander();
}

function addPipes(num) {
  let lx = pipeDistance;
  if (pipes.length > 0) {
    const [lastPipe] = pipes.slice(-1);
    const [lastPipeX] = lastPipe.getInfoArray();
    lx = lastPipeX + pipeDistance;
  }
  for (let i = 0; i < num; i++) {
    const x = lx + (pipeDistance * i);
    const g = (pipeDistance / 3) + random(0, 100);
    const gap = gapeSize * g;
    const y = random(gap / 3, canvas.height - gap);
    addPipe(x, y, canvas.width / 10, gap);
  }
}

function removePipe(index) {
  if (Number.isInteger(index))
    pipes.splice(index, 1);
  else
    pipes.splice(0, pipes.length);
  rander();
}

function addBird(x, y, radius, parentBird) {
  const bird = new Bird({
    x,
    y,
    radius,
    canvas,
    ctx,
    color: selectRandom(birdColors),
  });
  if (parentBird) {
    bird.brain = parentBird.brain.copy();
    const nn = bird.brain;
    nn.learningRate = this.learningRate * 2;
    if (nn.learningRate > 1)
      nn.learningRate = 1;
  }
  birds.push(bird);
  rander();
  return bird;
}

function removeBird(index) {
  if (Number.isInteger(index))
    birds.splice(index, 1);
  else
    birds.splice(0, birds.length);
  rander();
}

// Other usefull functions
function random(min, max) {
  return Math.random() * (max - min) + min;
}

function selectRandom(array) {
  return array[Math.round(random(0, array.length - 1))];
}

function checkCollision(bird, pipe) {
  const [birdX, birdY, birdR] = bird.getInfoArray();
  const [pipeX, pipeY, pipeW, pipeG] = pipe.getInfoArray();
  const isBetween = (p, a, b) => a <= p && p <= b;
  const xCollision = isBetween(birdX - birdR, pipeX, pipeX + pipeW) || isBetween(birdX + birdR, pipeX, pipeX + pipeW);
  const yCollision1 = isBetween(birdY - birdR, 0, pipeY) || isBetween(birdY + birdR, 0, pipeY);
  const yCollision2 = isBetween(birdY - birdR, pipeY + pipeG, canvas.height) || isBetween(birdY + birdR, pipeY + pipeG, canvas.height);
  return xCollision && (yCollision1 || yCollision2);
}

function randomGaussian(mean = 0, stdDev = 1) {
  const a = random(0, 1);
  const b = random(0, 1);
  const z = Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b);
  // const z = Math.sqrt(-2 * Math.log(a)) * Math.sin(2 * Math.PI * b);
  return mean + z * stdDev;
}

// Play yourself 
canvas.addEventListener("click", e => {
  return;
  // Remove return if you want to play;
  for (brid of birds)
    brid.jump();
});