// Setup.js - Updated for portrait uploads and relationship dropdowns

const familyData = [];
let selectedPersonId = null;

function addPerson() {
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const birthName = document.getElementById("birth-name").value.trim();
  const gender = document.getElementById("gender").value;
  const bgColor = document.getElementById("bg-color").value;
  const portraitInput = document.getElementById("portrait");
  const portraitFile = portraitInput.files[0];

  if (!firstName || !lastName || !portraitFile) {
    alert("Please fill out all fields and upload a portrait.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const portraitData = e.target.result;

    const person = {
      id: "id" + (familyData.length + 1),
      name: `${firstName} ${lastName}`,
      birthName: birthName,
      gender: gender,
      image: portraitData,
      bgColor: bgColor,
      children: [],
      partners: [],
      parents: []
    };

    familyData.push(person);
    updateTree();
    updateDropdowns();
  };

  reader.readAsDataURL(portraitFile);
}

function updateDropdowns() {
  const personDropdownA = document.getElementById("relationship-person-a");
  const personDropdownB = document.getElementById("relationship-person-b");
  personDropdownA.innerHTML = "";
  personDropdownB.innerHTML = "";

  familyData.forEach(person => {
    const optionA = document.createElement("option");
    optionA.value = person.id;
    optionA.textContent = person.name;
    personDropdownA.appendChild(optionA);

    const optionB = document.createElement("option");
    optionB.value = person.id;
    optionB.textContent = person.name;
    personDropdownB.appendChild(optionB);
  });
}

function setRelationship() {
  const personAId = document.getElementById("relationship-person-a").value;
  const personBId = document.getElementById("relationship-person-b").value;
  const relation = document.getElementById("relationship-type").value;

  const personA = familyData.find(p => p.id === personAId);
  const personB = familyData.find(p => p.id === personBId);

  if (!personA || !personB || personA.id === personB.id) {
    alert("Invalid relationship");
    return;
  }

  switch (relation) {
    case "parent":
      personB.parents.push(personA.id);
      break;
    case "child":
      personA.children.push(personB.id);
      break;
    case "partner":
      personA.partners.push(personB.id);
      personB.partners.push(personA.id);
      break;
    case "sibling":
      // A more robust sibling logic could be added here.
      break;
  }

  updateTree();
}

function updateTree() {
  const nodes = familyData.map(p => ({
    text: { name: p.name },
    image: p.image,
    HTMLclass: p.gender,
    connectors: { type: 'step' },
    innerHTML: `<div style='background-color:${p.bgColor}; padding: 5px;'>${p.name}<br><small>née ${p.birthName}</small></div>`
  }));

  const chart_config = {
    chart: {
      container: "#tree-container",
      connectors: { type: 'step' },
      node: { HTMLclass: 'nodeExample1' }
    },
    nodeStructure: nodes[0] || {}
  };

  document.getElementById("tree-container").innerHTML = "";
  new Treant(chart_config);
}
