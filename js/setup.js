let treeConfig = {
  chart: {
    container: "#tree-simple",
    connectors: {
      type: 'step'
    },
    node: {
      HTMLclass: 'nodeExample1'
    }
  },
  nodeStructure: {
    text: { name: "Root" },
    children: []
  }
};

let people = {};

function addPerson() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const maidenName = document.getElementById('maidenName').value.trim();
  
  if (!firstName || !lastName) {
    alert("Please fill in at least first and last name.");
    return;
  }

  // Your code to add the person to the tree...
}

  const fullName = maidenName ? `${firstName} ${lastName} (née ${maidenName})` : `${firstName} ${lastName}`;
  const newNode = {
    text: { name: fullName },
    children: []
  };

  people[fullName] = newNode;

  if (!relatedTo || !people[relatedTo]) {
    // Add to root if no relationship specified
    treeConfig.nodeStructure.children.push(newNode);
  } else {
    switch (relationship) {
      case 'parent':
        // Add new node as parent of existing
        const childNode = people[relatedTo];
        const newParent = {
          text: { name: fullName },
          children: [childNode]
        };
        // Replace child in root if it was there
        const index = treeConfig.nodeStructure.children.indexOf(childNode);
        if (index > -1) {
          treeConfig.nodeStructure.children.splice(index, 1, newParent);
        }
        people[fullName] = newParent;
        break;

      case 'child':
        people[relatedTo].children.push(newNode);
        break;

      case 'partner':
        const partnerNode = people[relatedTo];
        if (!partnerNode.partner) {
          partnerNode.partner = newNode;
          // Show as a sibling node under shared parent for simplicity
          const parentNode = {
            text: { name: "" },
            children: [partnerNode, newNode]
          };
          // Replace existing in root if needed
          const i = treeConfig.nodeStructure.children.indexOf(partnerNode);
          if (i > -1) {
            treeConfig.nodeStructure.children.splice(i, 1, parentNode);
          } else {
            treeConfig.nodeStructure.children.push(parentNode);
          }
        }
        break;

      case 'sibling':
        // Simplified: make a blank parent for both
        const existingNode = people[relatedTo];
        const siblingGroup = {
          text: { name: "" },
          children: [existingNode, newNode]
        };
        const idx = treeConfig.nodeStructure.children.indexOf(existingNode);
        if (idx > -1) {
          treeConfig.nodeStructure.children.splice(idx, 1, siblingGroup);
        } else {
          treeConfig.nodeStructure.children.push(siblingGroup);
        }
        break;
    }
  }

  document.getElementById('tree-simple').innerHTML = "";
  new Treant(treeConfig);

  // Clear form fields
  document.getElementById('firstName').value = "";
  document.getElementById('lastName').value = "";
  document.getElementById('maidenName').value = "";
  document.getElementById('relatedTo').value = "";
}
