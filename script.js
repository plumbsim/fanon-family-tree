// Fanon Family Tree Builder - script.js

let members = [];
let relationships = [];

const memberForm = document.getElementById("memberForm");
const treeCanvas = document.getElementById("treeCanvas");
const connectionCanvas = document.getElementById("connectionCanvas");
const ctx = connectionCanvas.getContext("2d");
const memberASelect = document.getElementById("memberA");
const memberBSelect = document.getElementById("memberB");

memberForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("nameInput").value;
  const image = document.getElementById("imageInput").files[0];
  const color1 = document.getElementById("color1").value;
  const color2 = document.getElementById("color2").value;
  const color3 = document.getElementById("color3").value;

  const reader = new FileReader();
  reader.onload = function () {
    const member = {
      id: members.length,
      name,
      imageSrc: reader.result,
      colors: [color1, color2, color3],
      level: 0,
    };
    members.push(member);
    addMemberCard(member);
    updateSelectMenus();
    drawConnections();
  };
  reader.readAsDataURL(image);

  memberForm.reset();
});

function addMemberCard(member) {
  let levelDiv = document.querySelector(`.treeLevel[data-level='${member.level}']`);
  if (!levelDiv) {
    levelDiv = document.createElement("div");
    levelDiv.classList.add("treeLevel");
    levelDiv.dataset.level = member.level;
    treeCanvas.appendChild(levelDiv);
  }

  const card = document.createElement("div");
  card.className = "memberCard";
  card.dataset.id = member.id;
  card.innerHTML = `
    <img src="${member.imageSrc}" alt="${member.name}" />
    <div class="name">${member.name}</div>
  `;

  levelDiv.appendChild(card);
}

function updateSelectMenus() {
  memberASelect.innerHTML = "";
  memberBSelect.innerHTML = "";
  members.forEach((m) => {
    const optionA = document.createElement("option");
    optionA.value = m.id;
    optionA.textContent = m.name;
    memberASelect.appendChild(optionA);

    const optionB = document.createElement("option");
    optionB.value = m.id;
    optionB.textContent = m.name;
    memberBSelect.appendChild(optionB);
  });
}

function createRelationship() {
  const idA = parseInt(memberASelect.value);
  const idB = parseInt(memberBSelect.value);
  const type = document.getElementById("relationshipType").value;
  if (idA === idB) return;

  relationships.push({ from: idA, to: idB, type });

  // Assign levels for vertical layout
  if (type === "parent") {
    members[idB].level = Math.max(members[idA].level + 1, members[idB].level);
  } else if (type === "child") {
    members[idA].level = Math.max(members[idB].level + 1, members[idA].level);
  } else if (type === "spouse") {
    members[idB].level = members[idA].level;
  } else if (type === "sibling") {
    members[idB].level = members[idA].level;
  }

  renderTree();
  drawConnections();
}

function renderTree() {
  treeCanvas.innerHTML = "";
  const levels = [...new Set(members.map((m) => m.level))].sort((a, b) => a - b);
  levels.forEach((lvl) => {
    const levelDiv = document.createElement("div");
    levelDiv.classList.add("treeLevel");
    levelDiv.dataset.level = lvl;
    treeCanvas.appendChild(levelDiv);

    members.filter((m) => m.level === lvl).forEach(addMemberCard);
  });
}

function drawConnections() {
  ctx.clearRect(0, 0, connectionCanvas.width, connectionCanvas.height);
  relationships.forEach(({ from, to, type }) => {
    const fromCard = document.querySelector(`[data-id='${from}']`);
    const toCard = document.querySelector(`[data-id='${to}']`);
    if (!fromCard || !toCard) return;

    const fromRect = fromCard.getBoundingClientRect();
    const toRect = toCard.getBoundingClientRect();

    const startX = fromRect.left + fromRect.width / 2 + window.scrollX;
    const startY = fromRect.bottom + window.scrollY;
    const endX = toRect.left + toRect.width / 2 + window.scrollX;
    const endY = toRect.top + window.scrollY;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = type === "spouse" ? "blue" : type === "sibling" ? "green" : "black";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

window.addEventListener("resize", drawConnections);
