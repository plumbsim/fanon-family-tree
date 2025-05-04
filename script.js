const members = {};
const relationships = [];
let canvas, ctx;

document.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('connectionCanvas');
  ctx = canvas.getContext('2d');

  document.getElementById('memberForm').addEventListener('submit', addMember);
});

function addMember(e) {
  e.preventDefault();
  const name = document.getElementById('nameInput').value;
  const file = document.getElementById('imageInput').files[0];
  const color1 = document.getElementById('color1').value;
  const color2 = document.getElementById('color2').value;
  const color3 = document.getElementById('color3').value;

  const reader = new FileReader();
  reader.onload = () => {
    const id = Date.now().toString();
    members[id] = {
      id,
      name,
      imageSrc: reader.result,
      colors: [color1, color2, color3],
      parents: [],
      children: [],
      spouses: [],
      level: 0,
    };
    updateSelectors();
    renderTree();
  };
  reader.readAsDataURL(file);
}

function updateSelectors() {
  const memberA = document.getElementById('memberA');
  const memberB = document.getElementById('memberB');
  [memberA, memberB].forEach(select => {
    select.innerHTML = '';
    Object.values(members).forEach(member => {
      const option = document.createElement('option');
      option.value = member.id;
      option.textContent = member.name;
      select.appendChild(option);
    });
  });
}

function createRelationship() {
  const idA = document.getElementById('memberA').value;
  const idB = document.getElementById('memberB').value;
  const type = document.getElementById('relationshipType').value;

  if (idA === idB) return alert("Cannot relate a member to themselves!");

  if (type === 'parent') {
    members[idA].children.push(idB);
    members[idB].parents.push(idA);
  } else if (type === 'child') {
    members[idA].parents.push(idB);
    members[idB].children.push(idA);
  } else if (type === 'spouse') {
    if (!members[idA].spouses.includes(idB)) members[idA].spouses.push(idB);
    if (!members[idB].spouses.includes(idA)) members[idB].spouses.push(idA);
  }

  relationships.push({ from: idA, to: idB, type });
  renderTree();
}

function renderTree() {
  const container = document.getElementById('treeCanvas');
  container.innerHTML = '';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  assignLevels();

  const levels = {};
  Object.values(members).forEach(member => {
    if (!levels[member.level]) levels[member.level] = [];
    levels[member.level].push(member);
  });

  const positions = {};

  Object.keys(levels).sort((a, b) => a - b).forEach(level => {
    const levelDiv = document.createElement('div');
    levelDiv.className = 'level';
    levels[level].forEach(member => {
      const card = document.createElement('div');
      card.className = 'memberCard';
      card.style.background = `linear-gradient(135deg, ${member.colors.join(',')})`;
      card.innerHTML = `<img src="${member.imageSrc}" alt="${member.name}" />
                        <div class="name">${member.name}</div>`;
      levelDiv.appendChild(card);
      member.element = card;
    });
    container.appendChild(levelDiv);
  });

  setTimeout(() => {
    Object.values(members).forEach(member => {
      const rect = member.element.getBoundingClientRect();
      positions[member.id] = {
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY
      };
    });

    relationships.forEach(rel => {
      const from = positions[rel.from];
      const to = positions[rel.to];
      if (!from || !to) return;

      if (rel.type === 'spouse') {
        drawSpouseBracket(from, to);
      } else if (rel.type === 'parent') {
        drawLine(from.x, from.y + 40, to.x, to.y - 40);
      }
    });
  }, 100);
}

function assignLevels() {
  Object.values(members).forEach(member => member.level = 0);
  const visited = new Set();

  function dfs(member, level) {
    if (visited.has(member.id)) return;
    visited.add(member.id);
    member.level = Math.max(member.level, level);
    member.children.forEach(cid => dfs(members[cid], level + 1));
  }

  Object.values(members)
    .filter(m => m.parents.length === 0)
    .forEach(m => dfs(m, 0));
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawSpouseBracket(p1, p2) {
  const x1 = Math.min(p1.x, p2.x);
  const x2 = Math.max(p1.x, p2.x);
  const y = (p1.y + p2.y) / 2 + 40;
  const midX = (x1 + x2) / 2;

  // Horizontal bracket
  drawLine(x1, y, x2, y);

  // Vertical drop from middle
  drawLine(midX, y, midX, y + 20);
}
