function calculate(operation, a, b) {
  return operation(a, b);
}

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function divide(x, y) {
  return x / y;
}

console.log("Add:", calculate(add, 10, 5));
console.log("Subtract:", calculate(subtract, 10, 5));
console.log("Multiply:", calculate((x, y) => x * y, 4, 5));
console.log("Divide:", calculate(divide, 20, 4));
