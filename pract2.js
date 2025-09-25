console.log("var x before declaration:", x);

var x = 10;
console.log("var x after declaration:", x);

try {
    console.log("let y before declaration:", y);
} catch (error) {
    console.log("Error with let y:", error.message);
}
let y = 20;
console.log("let y after declaration:", y);

try {
    console.log("const z before declaration:", z);
} catch (error) {
    console.log("Error with const z:", error.message);
}
const z = 30;
console.log("const z after declaration:", z);
