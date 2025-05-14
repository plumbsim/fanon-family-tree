// Initial family tree configuration
const chart_config = {
  chart: {
    container: "#tree-simple",
    node: {
      HTMLclass: "nodeExample1"
    },
    connectors: {
      type: "step"
    },
    animateOnInit: true
  },
  nodeStructure: {
    text: {
      name: "First Last",
      title: "Optional Title"
    }
  }
};

// Global variable to track the current chart
let tree;

// Wait until DOM is ready before initializing
document.addEventListener("DOMContentLoaded", function () {
  tree = new Treant(chart_config);
});

// Example of an addPerson function
function addPerson() {
  alert("Add Person function triggered!");

  // This is where you'd expand your logic to allow adding a person dynamically.
  // For now, this just demonstrates the function is working.

  // Example placeholder for adding logic:
  // You would likely want to collect input data and rebuild the tree structure.
}
