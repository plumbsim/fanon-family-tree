let members = [];
let relationships = [];

document.getElementById("memberForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("nameInput").value;
  const imageInput = document.getElementById("imageInput");
  const color1 = document.getElementById("color1").value;
  const color2 = document.getElementById("color2").value;
  const color3 = document.getElementById("color3").value;

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageUrl = e.target.result;
    const newMember = {
      id: members.length,
      name,
      imageUrl,
      colors: [color1, color2, color3],
      level: 0,
    };
    members.push(newMember);
    updateMemberOptions();
    renderTree();
  };
  reader.readAsDataURL(imageInput.files[0]);

  e.target.reset();
});

function updateMemberOptions() {
  const selects = [document.getElementById("memberA"), document.getElementById("memberB")];
  selects.forEach(select => {
    select.innerHTML = "";
    members.forEach(member => {
      const option = document.createElement("option");
      option.value = member.id;
      option.textContent = member.name;
      select.appendChild(option);
    });
  });
}

function createRelationship() {
  const memberA = parseInt(document.getElementById("memberA").value);
  const memberB = parseInt(document.getElementById("memberB").value);
  const type = document.getElementById("relationshipType").value;

  if (memberA === memberB) return;

  relationships.push({ from: memberA, to: memberB, type });
  assignLevels();
  renderTree();
}

function assignLevels() {
  members.forEach(m => m.level = 0);
  const graph = {};
  members.forEach(m => graph[m.id] = []);

  relationships.forEach(r => {
    if (r.type === "parent") {
      graph[r.from].push(r.to);
    }
  });

  function dfs(node, level) {
    members[node].level = Math.max(members[node].level, level);
    graph[node].forEach(child => dfs(child, level + 1));
  }

  for (let i = 0; i < members.length; i++) {
    dfs(i, 0);
  }
}

function renderTree() {
  const treeCanvas = document.getElementById("treeCanvas");
  treeCanvas.innerHTML = "";

  const levels = {};
  members.forEach(member => {
    if (!levels[member.level]) levels[member.level] = [];
    levels[member.level].push(member);
  });

  Object.keys(levels).sort((a, b) => a - b).forEach(level => {
    const levelDiv = document.createElement("div");
    levelDiv.className = "tree-level";
    levels[level].forEach(member => {
      const card = document.createElement("div");
      card.className = "memberCard";
      card.setAttribute("data-id", member.id);

      const img = document.createElement("img");
      img.src = member.imageUrl;

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = member.name;

      const gradient = `linear-gradient(to bottom, ${member.colors[0]}, ${member.colors[1]}, ${member.colors[2]})`;
      card.style.background = gradient;

      card.appendChild(img);
      card.appendChild(name);
      levelDiv.appendChild(card);
    });
    treeCanvas.appendChild(levelDiv);
  });

  drawConnections();
}

function getMemberPosition(id) {
  const card = document.querySelector(`.memberCard[data-id='${id}']`);
  if (!card) return null;
  const rect = card.getBoundingClientRect();
  const container = document.getElementById("treeCanvas").getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - container.left,
    y: rect.top + rect.height / 2 - container.top
  };
}

function drawConnections() {
  const canvas = document.getElementById("connectionCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  relationships.forEach(({ from, to, type }) => {
    const posA = getMemberPosition(from);
    const posB = getMemberPosition(to);
    if (!posA || !posB) return;

    ctx.beginPath();
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;

    if (type === "parent") {
      ctx.moveTo(posA.x, posA.y + 75);
      ctx.lineTo(posB.x, posB.y - 75);
    } else if (type === "spouse") {
      const midY = (posA.y + posB.y) / 2 + 40;
      ctx.moveTo(posA.x, posA.y + 75);
      ctx.lineTo(posA.x, midY);
      ctx.lineTo(posB.x, midY);
      ctx.lineTo(posB.x, posB.y + 75);
    }

    ctx.stroke();
  });
}
