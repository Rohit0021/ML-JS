import NeuralNetwork from "../../../NeuralNetwork.js";

const data = [
  { inputs: [1, 1], outputs: [0] },
  { inputs: [0, 0], outputs: [0] },
  { inputs: [1, 0], outputs: [1] },
  { inputs: [0, 1], outputs: [1] },
];

const nn = new NeuralNetwork(
  2, // Num of inputs
  1, // Num of outputs
  [3, 2] // Num of neurons in each respective hidden layer
);

// showHeadline("Trainning...");
// const counts = nn.train(data, 25_000);
// console.table(counts);

const test = () => {
  let str = "";
  let done = true;
  for (const d of data) {
    const { inputs, outputs } = d;
    const ans = nn.predict(inputs);
    const res = !outputs.some((correct, i) => ans[i] !== correct);
    if (!res) done = false;
    str += "\t" + inputs.join(", ") + " -> " + ans.join(", ") + "\t" + (res ? "[✓]" : "[×]") + "\n";
  }
  // console.log(str);
  showOutput(str);
  return done;
};

/*
  NOTE: sometimes the prediction can be wrong because of incorrect weights and biases. they can be fixed by trainning more.
 */

const run = () => {
  showHeadline("Trainning...");
  nn.setLearningRate(0.2);
  const counts = nn.train(data, 1);
  // console.table(counts);
  const isDone = test();
  if (!isDone)
    requestAnimationFrame(run);
  else
    showHeadline("Trainning finished !");
};

requestAnimationFrame(run);
