// Updated script.js for bracket-style spouse-child connections

const members = [];
const relationships = [];

const memberForm = document.getElementById("memberForm");
const treeCanvas = document.getElementById("treeCanvas");
const memberASelect = document.getElementById("memberA");
const memberBSelect = document.getElementById("memberB");
const relationshipType = document.getElementById("relationshipType");
const canvas = document.getElementById("connectionCanvas");
const ctx = canvas.getContext("2d");

memberForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("nameInput").value;
  const image = document.getElementById("imageInput").files[0];

  if (!name || !image) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const imageUrl = event.target.result;

    const member = {
      id: members.length,
      name,
      imageUrl,
      x: 200 * (members.length % 5),
      y: 150 * Math.floor(members.length / 5),
      spouses: [],
      children: [],
      parents: []
    };
    members.push(member);
    updateDropdowns();
    renderTree();
  };
  reader.readAsDataURL(image);

  memberForm.reset();
});

function updateDropdowns() {
  [memberASelect, memberBSelect].forEach(select => {
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
  const aId = parseInt(memberASelect.value);
  const bId = parseInt(memberBSelect.value);
  const type = relationshipType.value;

  if (aId === bId) return;

  const a = members[aId];
  const b = members[bId];

  if (type === "spouse") {
    if (!a.spouses.includes(b.id)) a.spouses.push(b.id);
    if (!b.spouses.includes(a.id)) b.spouses.push(a.id);
  } else if (type === "parent") {
    if (!a.children.includes(b.id)) a.children.push(b.id);
    if (!b.parents.includes(a.id)) b.parents.push(a.id);
  } else if (type === "child") {
    if (!b.children.includes(a.id)) b.children.push(a.id);
    if (!a.parents.includes(b.id)) a.parents.push(b.id);
  }

  renderTree();
}

function renderTree() {
  treeCanvas.innerHTML = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  members.forEach(member => {
    const div = document.createElement("div");
    div.className = "memberCard";
    div.style.left = member.x + "px";
    div.style.top = member.y + "px";
    div.style.position = "absolute";

    const img = document.createElement("img");
    img.src = member.imageUrl;
    div.appendChild(img);

    const nameTag = document.createElement("div");
    nameTag.className = "name";
    nameTag.textContent = member.name;
    div.appendChild(nameTag);

    treeCanvas.appendChild(div);
  });

  // Draw lines
  members.forEach(member => {
    // Draw spouse bracket
    member.spouses.forEach(spouseId => {
      if (member.id < spouseId) { // avoid duplicate lines
        const spouse = members[spouseId];
        const x1 = member.x + 75;
        const x2 = spouse.x + 75;
        const y = Math.max(member.y, spouse.y) + 140;

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Connect midpoint to children
        const midX = (x1 + x2) / 2;
        ctx.beginPath();
        ctx.moveTo(midX, y);
        ctx.lineTo(midX, y + 20);
        ctx.stroke();

        // Draw child lines
        member.children.forEach(childId => {
          const child = members[childId];
          const cx = child.x + 75;
          const cy = child.y;
          ctx.beginPath();
          ctx.moveTo(midX, y + 20);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        });
      }
    });

    // Draw parent lines if no spouse
    if (member.parents.length === 1) {
      const parent = members[member.parents[0]];
      const x1 = parent.x + 75;
      const x2 = member.x + 75;
      const y1 = parent.y + 150;
      const y2 = member.y;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  });
}
