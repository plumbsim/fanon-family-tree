// script.js
const memberForm = document.getElementById("memberForm");
const treeCanvas = document.getElementById("treeCanvas");
const connectionCanvas = document.getElementById("connectionCanvas");
const ctx = connectionCanvas.getContext("2d");

const memberASelect = document.getElementById("memberA");
const memberBSelect = document.getElementById("memberB");
const relationshipTypeSelect = document.getElementById("relationshipType");

let members = [];
let relationships = [];

memberForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("nameInput").value;
  const imageFile = document.getElementById("imageInput").files[0];
  const color1 = document.getElementById("color1").value;
  const color2 = document.getElementById("color2").value;
  const color3 = document.getElementById("color3").value;

  const reader = new FileReader();
  reader.onload = function () {
    const imageUrl = reader.result;
    const member = {
      id: members.length,
      name,
      imageUrl,
      colors: [color1, color2, color3],
      element: null,
      level: 0
    };
    members.push(member);
    addMemberToSelect(member);
    renderTree();
  };
  if (imageFile) {
    reader.readAsDataURL(imageFile);
  }
});

function addMemberToSelect(member) {
  const optionA = document.createElement("option");
  optionA.value = member.id;
  optionA.textContent = member.name;
  memberASelect.appendChild(optionA);

  const optionB = document.createElement("option");
  optionB.value = member.id;
  optionB.textContent = member.name;
  memberBSelect.appendChild(optionB);
}

function createRelationship() {
  const memberA = parseInt(memberASelect.value);
  const memberB = parseInt(memberBSelect.value);
  const type = relationshipTypeSelect.value;

  if (isNaN(memberA) || isNaN(memberB) || memberA === memberB) return;

  relationships.push({ memberA, memberB, type });
  renderTree();
}

function renderTree() {
  treeCanvas.innerHTML = "";
  ctx.clearRect(0, 0, connectionCanvas.width, connectionCanvas.height);

  const levels = {};
  members.forEach((member) => {
    member.level = 0;
  });

  relationships.forEach((rel) => {
    if (rel.type === "parent") {
      const parent = members[rel.memberA];
      const child = members[rel.memberB];
      child.level = Math.max(child.level, parent.level + 1);
    }
  });

  members.forEach((member) => {
    if (!levels[member.level]) levels[member.level] = [];
    levels[member.level].push(member);
  });

  const levelKeys = Object.keys(levels).sort((a, b) => a - b);

  levelKeys.forEach((level) => {
    const row = document.createElement("div");
    row.className = "level";
    levels[level].forEach((member) => {
      const card = document.createElement("div");
      card.className = "memberCard";
      card.style.background = `linear-gradient(to bottom right, ${
        member.colors[0] || "#ccc"
      }, ${member.colors[1] || "#ccc"}, ${member.colors[2] || "#ccc"})`;

      const img = document.createElement("img");
      img.src = member.imageUrl;
      const nameDiv = document.createElement("div");
      nameDiv.className = "name";
      nameDiv.textContent = member.name;

      card.appendChild(img);
      card.appendChild(nameDiv);
      row.appendChild(card);

      member.element = card;
    });
    treeCanvas.appendChild(row);
  });

  drawConnections();
}

function drawConnections() {
  relationships.forEach((rel) => {
    const from = members[rel.memberA].element;
    const to = members[rel.memberB].element;

    if (!from || !to) return;

    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const canvasRect = connectionCanvas.getBoundingClientRect();

    const startX = fromRect.left + fromRect.width / 2 - canvasRect.left;
    const startY = fromRect.bottom - canvasRect.top;
    const endX = toRect.left + toRect.width / 2 - canvasRect.left;
    const endY = toRect.top - canvasRect.top;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}
