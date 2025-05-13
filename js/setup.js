const family = [];

function addPerson() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const birthName = document.getElementById("birthName").value;

  const fullName = `${firstName} ${lastName}`;
  const displayText = { name: fullName };

  if (birthName.trim() !== "") {
    displayText.title = `Née: ${birthName}`;
  }

  const newPerson = {
    text: displayText
    // Add other properties as needed
  };

  // Logic to add newPerson to your tree structure
  // and re-render the tree
}

  if (family.length === 0) {
    // First person becomes the root
    family.push(newNode);
  } else {
    // Add as child of root for now (we'll add relationship logic later)
    newNode.parent = family[0];
    family.push(newNode);
  }

  renderTree();
}

function renderTree() {
  const root = family[0];

  if (!root) return;

  // Rebuild tree structure dynamically
  for (let i = 1; i < family.length; i++) {
    family[i].parent = root; // simple model: everyone is child of root
  }

  const config = {
    chart: {
      container: "#tree-simple"
    },
    nodeStructure: buildTreeStructure(root)
  };

  new Treant(config);
}

// Recursively build node tree
function buildTreeStructure(node) {
  const children = family.filter(n => n.parent === node);
  const cloned = { ...node };
  if (children.length) {
    cloned.children = children.map(buildTreeStructure);
  }
  return cloned;
}
