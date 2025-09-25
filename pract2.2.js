const person = {
  name: "Naina",

  normalFunc: function () {
    console.log("Normal Function this.name:", this.name);
    console.log("Normal Function this:", this);
  },

  arrowFunc: () => {
    console.log("Arrow Function this.name:", this.name);
    console.log("Arrow Function this:", this);
  }
};

person.normalFunc();
person.arrowFunc();
