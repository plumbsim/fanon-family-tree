// Family Tree Script

const memberForm = document.getElementById("memberForm");
const nameInput = document.getElementById("nameInput");
const imageInput = document.getElementById("imageInput");
const treeCanvas = document.getElementById("treeCanvas");
const connectionCanvas = document.getElementById("connectionCanvas");
const ctx = connectionCanvas.getContext("2d");

const relationshipForm = document.getElementById("relationshipForm");
const memberASelect = document.getElementById("memberA");
const memberBSelect = document.getElementById("memberB");
const relationshipTypeSelect = document.getElementById("relationshipType");

let members = [];
let relationships = [];

memberForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const image = imageInput.files[0];

  const reader = new FileReader();
  reader.onload = function () {
    const imageUrl = reader.result;
    const member = {
      id: Date.now(),
      name,
      imageUrl,
      x: 0,
      y: 0,
    };
    members.push(member);
    updateSelectOptions();
    renderMembers();
  };
  if (image) {
    reader.readAsDataURL(image);
  }

  memberForm.reset();
});

function updateSelectOptions() {
  memberASelect.innerHTML = "";
  memberBSelect.innerHTML = "";
  members.forEach((member) => {
    const optionA = document.createElement("option");
    optionA.value = member.id;
    optionA.textContent = member.name;
    memberASelect.appendChild(optionA);

    const optionB = document.createElement("option");
    optionB.value = member.id;
    optionB.textContent = member.name;
    memberBSelect.appendChild(optionB);
  });
}

function createRelationship() {
  const idA = parseInt(memberASelect.value);
  const idB = parseInt(memberBSelect.value);
  const type = relationshipTypeSelect.value;

  if (idA !== idB) {
    relationships.push({ from: idA, to: idB, type });
    renderMembers();
  }
}

function renderMembers() {
  treeCanvas.innerHTML = "";

  // Simple vertical stacking for now
  members.forEach((member, index) => {
    member.x = 200 + (index % 5) * 180;
    member.y = 100 + Math.floor(index / 5) * 220;

    const card = document.createElement("div");
    card.className = "memberCard";
    card.style.left = member.x + "px";
    card.style.top = member.y + "px";
    card.style.position = "absolute";

    const img = document.createElement("img");
    img.src = member.imageUrl;
    card.appendChild(img);

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = member.name;
    card.appendChild(name);

    treeCanvas.appendChild(card);
  });

  drawConnections();
}

function drawConnections() {
  ctx.clearRect(0, 0, connectionCanvas.width, connectionCanvas.height);

  relationships.forEach((rel) => {
    const fromMember = members.find((m) => m.id === rel.from);
    const toMember = members.find((m) => m.id === rel.to);

    if (!fromMember || !toMember) return;

    const fromX = fromMember.x + 75;
    const fromY = fromMember.y + 150;
    const toX = toMember.x + 75;
    const toY = toMember.y;

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    if (rel.type === "parent") {
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
    } else if (rel.type === "sibling") {
      ctx.moveTo(fromX, fromY - 100);
      ctx.lineTo(toX, toY - 100);
    } else if (rel.type === "spouse") {
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, fromY);
    }

    ctx.stroke();
  });
}

relationshipForm.querySelector("button").addEventListener("click", createRelationship);
