console.log("Calling add before declaration:", add(2, 3));

try {
  console.log("Calling multiply before declaration:", multiply(2, 3));
} catch (error) {
  console.log("Error calling multiply before declaration:", error.message);
}

function add(a, b) {
  return a + b;
}

const multiply = function (a, b) {
  return a * b;
};

console.log("Calling add after declaration:", add(5, 7));
console.log("Calling multiply after declaration:", multiply(5, 7));
