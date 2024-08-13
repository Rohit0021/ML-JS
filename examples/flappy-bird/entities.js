import NeuralNetwork from "../../../NeuralNetwork.js";

class Pipe {
  constructor({
    x,
    y,
    width,
    gap,
    canvas,
    ctx,
    bgColor,
    color
  }) {
    this.position = [x, y];
    this.width = width;
    this.gap = gap;
    this.ctx = ctx;
    this.canvas = canvas;
    this.bgColor = bgColor;
    this.color = color;
  }

  update(n) {
    this.position[0] += n;
  }

  draw() {
    const [x, y] = this.position;
    const {
      width,
      gap,
      canvas,
      ctx,
      bgColor,
      color
    } = this;
    const height = canvas.height;
    ctx.fillStyle = color;
    ctx.fillRect(x, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, gap);
  }

  getInfoArray() {
    return [...this.position, this.width, this.gap];
  }
}

class Bird {
  constructor({
    x,
    y,
    radius,
    canvas,
    ctx,
    color
  }) {
    this.position = [x, y];
    this.radius = radius;
    this.ctx = ctx;
    this.canvas = canvas;
    this.color = color;
    this.isActive = true;
    this.brain = new NeuralNetwork(7, 1, [2]);
    this.score = 0;
  }

  getInputs(pipes) {
    let pipeInfo = [0, 0, 0, 0];
    for (const pipe of pipes) {
      const [x] = this.position;
      const [pipeX] = pipe.position;
      if (pipeX > x)
        pipeInfo = [...pipe.position, pipe.width, pipe.gap];
    };
    const inputs = [...this.position, this.radius, ...pipeInfo];
    return inputs;
  }

  think(pipes) {
    const inputs = this.getInputs(pipes);
    const [output] = this.brain.predict(inputs);
    return output;
  }

  train(pipes) {
    const inputs = this.getInputs(pipes);
    const [x, y, r, pc, py, w, g] = inputs;
    const outputs = [0, 1].filter(out => evalScore(out, y, py, g));
    this.brain.setLearningRate(learningRate);
    this.brain.train({ inputs, outputs }, traningSets);
  }

  updateScore(pipes, out) {
    if (out === undefined) {
      this.score++;
      return;
    }
    const [x, y, r, pc, py, w, g] = this.getInputs(pipes);
    this.score += evalScore(out, y, py, g);
  }

  jump() {
    this.update(-jumpForce);
  }

  update(n) {
    this.position[1] += n;
  }

  isAlive() {
    return this.isActive;
  }

  kill() {
    this.isActive = false;
  }

  draw() {
    const [x, y] = this.position;
    const { color, radius } = this;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  getInfoArray() {
    return [...this.position, this.radius];
  }
}

// This is very important function as it evaluate scores which determines the parents who will give the child for next generation
function evalScore(output, birdY, pipeY, pipeG) {
  let reward = 0;
  const pipe = pipeY + (pipeG / 2.9);
  console.log();
  if (birdY > pipe && output === 1)
    reward++;
  if (birdY < pipe && output === 0)
    reward++;
  if (birdY < pipeY + pipeG && birdY > pipeY)
    reward++;
  else
    reward--;
  return reward;
}

function exportModule(name, module) {
  window[name] = module;
}

exportModule("Pipe", Pipe);
exportModule("Bird", Bird);