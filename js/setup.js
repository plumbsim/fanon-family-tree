let family = [];
let selectedPersonId = null;

function addPerson() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const birthName = document.getElementById("birthName").value.trim();
  const portraitFile = document.getElementById("portrait").files[0];
  const gender = document.getElementById("gender").value;
  const bgColor = document.getElementById("bgColor").value;

  if (!firstName || !lastName) return alert("First and Last name are required.");

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageUrl = e.target.result;
    const id = family.length;
    const person = {
      id,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      birthName,
      gender,
      bgColor,
      img: imageUrl,
      children: [],
      parentA: null,
      parentB: null,
      partner: null
    };
    family.push(person);
    updateDropdowns();
    renderTree();
  };
  if (portraitFile) {
    reader.readAsDataURL(portraitFile);
  } else {
    reader.onload({ target: { result: "" } });
  }
}

function updateDropdowns() {
  const relatedToSelect = document.getElementById("relatedTo");
  relatedToSelect.innerHTML = "";
  family.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.firstName} ${p.lastName}`;
    relatedToSelect.appendChild(option);
  });
}

function setRelationship() {
  const type = document.getElementById("relationshipType").value;
  const targetId = parseInt(document.getElementById("relatedTo").value);
  const person = family[selectedPersonId];
  const target = family[targetId];

  if (!person || !target) return;

  switch (type) {
    case "parentA":
      person.parentA = target.id;
      break;
    case "parentB":
      person.parentB = target.id;
      break;
    case "partner":
      person.partner = target.id;
      break;
    case "child":
      target.children.push(person.id);
      break;
    case "sibling":
      if (!person.parentA && target.parentA) person.parentA = target.parentA;
      if (!person.parentB && target.parentB) person.parentB = target.parentB;
      break;
  }
  renderTree();
}

function selectPerson(id) {
  selectedPersonId = id;
  const person = family[id];
  document.getElementById("selected-name").textContent = `${person.firstName} ${person.lastName}`.toUpperCase();
}

function renderTree() {
  const nodes = family.map(p => {
    return {
      HTMLclass: "person-node",
      text: { name: p.name },
      image: p.img || undefined,
      stackChildren: true,
      id: p.id,
      connectors: { type: 'step' },
      innerHTML: `<div onclick="selectPerson(${p.id})" style="background-color: ${p.bgColor}; padding: 10px; border: 2px solid black">${p.name}</div>`
    };
  });

  const chartStructure = {
    chart: {
      container: "#tree",
      node: { collapsable: true },
      connectors: { type: "step" },
      animateOnInit: true
    },
    nodeStructure: buildTreeStructure()
  };

  new Treant(chartStructure);
}

function buildTreeStructure() {
  const roots = family.filter(p => p.parentA === null && p.parentB === null);
  if (roots.length === 0) return {};
  return buildNodeRecursive(roots[0]);
}

function buildNodeRecursive(person) {
  const children = family.filter(p => p.parentA === person.id || p.parentB === person.id);
  return {
    text: { name: person.name },
    image: person.img || undefined,
    HTMLclass: "person-node",
    innerHTML: `<div onclick="selectPerson(${person.id})" style="background-color: ${person.bgColor}; padding: 10px; border: 2px solid black">${person.name}</div>`,
    children: children.map(child => buildNodeRecursive(child))
  };
}
