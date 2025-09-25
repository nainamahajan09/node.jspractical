const EventEmitter = require('events');


const myEmitter = new EventEmitter();


const eventName = 'greet';

myEmitter.on(eventName, (name) => {
  console.log(`Hello, ${name}! Welcome `);
});
myEmitter.emit(eventName, 'Naina');