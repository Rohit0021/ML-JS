export default class NeuralNetwork {
  // Learning rate & activation fuction
  minLearning = 0.4;
  learningRate = 0.9;
  layers = [];
  activation = {
    fn: x => 1 / (1 + Math.exp(-x)),
    dydx: y => y * (1 - y),
  };

  constructor(numOfInputs, numOfOutputs, hinddenLayers) {
    // Initialize the layers
    for (const i in hinddenLayers) {
      const numOfNeurons = hinddenLayers[i];
      const numOfNeuronsInPreLayer = hinddenLayers[i - 1] || numOfInputs;
      this.addLayer(numOfNeurons, numOfNeuronsInPreLayer);
    }
    // Output layer
    this.addLayer(numOfOutputs, hinddenLayers.slice(-1).pop());
    // Add values to weights and biases
    this.randomize();
  }

  addLayer(numOfNeurons, numOfNeuronsInPreLayer) {
    // Add layer with weights and biases
    const weights = [...new Array(numOfNeurons)];
    for (const i in weights)
      weights[i] = [...new Array(numOfNeuronsInPreLayer)];
    const biases = [...new Array(numOfNeurons)];
    this.layers
      .push({ weights, biases });
  }

  randomize() {
    const random = () => Math.random();
    for (const layer of this.layers) {
      // Randomize weights
      for (const i in layer.weights)
        for (const j in layer.weights[i])
          layer.weights[i][j] = random();
      // Randomize biases
      for (const i in layer.biases)
        layer.biases[i] = random();
    }
  }

  feed(inputs) {
    const outputs = [];
    for (const layer of this.layers) {
      const { weights, biases } = layer;
      const weightedSums = [];
      for (const n in weights) {
        const weightedInps = [];
        // Multiple weights with inputs
        for (const m in weights[n])
          weightedInps[m] = weights[n][m] * inputs[m];
        // Add weighted sum
        weightedSums.push(weightedInps.reduce((pre, curr) => pre + curr));
      }
      // Add biases to weighted sums
      for (const i in biases)
        weightedSums[i] = weightedSums[i] + biases[i];
      // Apply activation function
      const answers = weightedSums.map(this.activation.fn);
      outputs.push(answers);
      inputs = answers;
    }
    return outputs;
  }

  predict(inputs) {
    const outputs = this.feed(inputs);
    return outputs.slice(-1)[0];
  }

  train(data, numOfTrainningSets) {
    const trainningCount = {};
    const count = i => {
      if (trainningCount[i])
        trainningCount[i]++;
      else
        trainningCount[i] = 1;
    };
    const iters = numOfTrainningSets * data.length;
    for (let i = 0; i < iters; i++) {
      // Selecting random data for training
      const getRandomIndex = () => {
        const len = data.length;
        let num = Math.random() * len;
        num = Math.round(num) - 1;
        return num < 0 ? len - 1 : num;
      };
      const index = getRandomIndex();
      count(index);
      const rData = data[index];
      const inputs = rData.inputs;
      const targets = rData.outputs;
      // Actual training
      const predictions = this.feed(inputs);
      const [outputs] = predictions.slice(-1);
      const errors = outputs.map((out, index) => out - targets[index]);
      // Backpropogarion
      const derivatives = predictions.map(arr => arr.map(this.activation.dydx));
      const gradients = [errors];
      for (let l = this.layers.length - 2; l >= 0; l--) {
        const [preGrad] = gradients.slice(-1);
        const gradient = this.layers[l].biases.map(() => undefined);
        const { weights } = this.layers[l + 1];
        for (let i in gradient) {
          let sum = 0;
          for (let j in preGrad)
            sum += preGrad[j] * weights[j][i];
          gradient[i] = sum;
        }
        gradients.unshift(gradient);
      }
      // Change the weights and biases
      for (const l in this.layers) {
        const { biases, weights } = this.layers[l];
        for (const i in weights) {
          for (const j in weights[i]) {
            const r = this.learningRate;
            const g = gradients[l][i];
            const d = derivatives[l][i];
            const a = l > 0 ? predictions[l - 1][j] : inputs[j];
            const delta = r * a * g * d;
            weights[i][j] -= delta;
          }
        }
        for (const i in biases) {
          const r = this.learningRate;
          const g = gradients[l][i];
          const d = derivatives[l][i];
          biases[i] -= r * g * d;
        }
      }
      const lr = this.learningRate;
      const min = this.minLearning;
      if (lr > min)
        this.learningRate -= lr / 4;
    }
    return trainningCount;
  }
}