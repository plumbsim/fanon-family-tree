// Create the base node (root of the tree)
const rootNode = {
  text: { name: "Root Character", title: "The Origin" },
  HTMLclass: "root"
};

// Tree data structure
let treeData = [rootNode];

// Treant chart configuration
const chartConfig = {
  chart: {
    container: "#tree-simple",
    rootOrientation: "NORTH",
    nodeAlign: "BOTTOM",
    connectors: {
      type: "step"
    },
    node: {
      HTMLclass: "nodeExample1"
    }
  },
  nodeStructure: rootNode
};

// Initialize tree on page load
window.onload = function () {
  new Treant(chartConfig);
};

// Add person function
function addPerson() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const birthName = document.getElementById("birthName").value.trim();

  if (!firstName || !lastName) {
    alert("Please provide both first and last names.");
    return;
  }

  const fullName = `${firstName} ${lastName}`;
  const titleText = birthName ? `Née: ${birthName}` : "";

  const newPerson = {
    parent: rootNode,
    text: {
      name: fullName,
      title: titleText
    }
  };

  // Add new person to tree
  if (!rootNode.children) {
    rootNode.children = [];
  }
  rootNode.children.push(newPerson);

  // Re-render the tree
  document.getElementById("tree-simple").innerHTML = ""; // Clear previous render
  new Treant(chartConfig);
}
