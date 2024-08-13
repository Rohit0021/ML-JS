// Control global variables

const traningSets = 15; // number of sets to train every bird with random output
const population = 250; // population count
const mutationRate = 0.4; // rate of change in each individual of the generation
const selectionRate = 0.3; // best bird selection rate
const learningRate = 0.2; // minimum learning for training birds

const jumpForce = 2; // jump strength
const pipeSpeed = 2; // pipe left speed
const gravity = 1; // bird down speed

const pipeDistanceAlpha = 0.66; // distance between pipes (less val == more distance)
const birdSize = 4; // bird size
const gapeSize = 1.3; // pipe gap size

const bgColor = "black"; // color of background
const pipeColor = "gray"; // color of pipe

const birdColors = [
  "red",
  "blue",
  "green",
  "yellow",
  "pink",
  "purple",
  "cyan",
]; // colors for birds
