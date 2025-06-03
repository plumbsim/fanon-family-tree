// setup.js

let familyData = [];
let selectedPersonId = null;
let idCounter = 0;

function addPerson() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const birthName = document.getElementById("birthName").value.trim();
  const portrait = document.getElementById("portrait").value.trim();
  const gender = document.getElementById("gender").value;
  const bgColor = document.getElementById("bgColor").value;

  if (!firstName || !lastName) return alert("First and Last name are required.");

  const id = `person_${idCounter++}`;
  const fullName = `${firstName} ${lastName}`;

  const node = {
    id,
    text: {
      name: fullName,
      title: birthName ? `Née ${birthName}` : ""
    },
    image: portrait || null,
    HTMLclass: gender,
    innerHTML: '',
    connectors: { style: { stroke: '#000', 'arrow-end': 'none' } },
    stackChildren: true,
    children: []
  };

  node.HTMLid = id;
  node.backgroundColor = bgColor;
  node.clickHandler = () => selectPerson(id);

  familyData.push(node);
  updateDropdowns();
  renderTree();
}

function updateDropdowns() {
  const dropdown = document.getElementById("relationTarget");
  dropdown.innerHTML = '<option value="">Select another person</option>';

  familyData.forEach(person => {
    if (person.id !== selectedPersonId) {
      const option = document.createElement("option");
      option.value = person.id;
      option.textContent = person.text.name;
      dropdown.appendChild(option);
    }
  });
}

function selectPerson(id) {
  selectedPersonId = id;
  const selected = familyData.find(p => p.id === id);
  document.getElementById("selectedPersonLabel").innerHTML = `${selected.text.name.toUpperCase()}'s relationship to`;
  updateDropdowns();
}

function setRelationship() {
  const targetId = document.getElementById("relationTarget").value;
  const relation = document.getElementById("relationType").value;

  if (!selectedPersonId || !targetId || !relation) return alert("Fill in all relationship fields.");

  const selected = familyData.find(p => p.id === selectedPersonId);
  const target = familyData.find(p => p.id === targetId);

  switch (relation) {
    case "partner":
      if (!selected.partners) selected.partners = [];
      if (!target.partners) target.partners = [];
      selected.partners.push(target);
      target.partners.push(selected);
      break;
    case "parentA":
    case "parentB":
      if (!target.children) target.children = [];
      target.children.push(selected);
      break;
    case "child":
      if (!selected.children) selected.children = [];
      selected.children.push(target);
      break;
    case "sibling":
      // simplified: add to a shared parent
      break;
  }

  renderTree();
}

function renderTree() {
  const config = {
    chart: {
      container: "#tree",
      connectors: {
        type: 'step',
        style: { stroke: '#000000' }
      },
      node: {
        HTMLclass: 'nodeExample1'
      }
    },
    nodeStructure: buildHierarchy()
  };

  document.getElementById("tree").innerHTML = "";
  new Treant(config);
}

function buildHierarchy() {
  if (familyData.length === 0) return {};

  const root = familyData[0];

  function buildNode(person) {
    const node = {
      text: person.text,
      image: person.image,
      HTMLid: person.id,
      children: []
    };
    if (person.children) {
      node.children = person.children.map(buildNode);
    }
    return node;
  }

  return buildNode(root);
}
