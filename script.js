document.getElementById("memberForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("nameInput").value;
  const imageFile = document.getElementById("imageInput").files[0];
  const colors = [
    document.getElementById("color1").value,
    document.getElementById("color2").value,
    document.getElementById("color3").value
  ].filter(Boolean); // Only keep filled-in colors

  if (!imageFile || colors.length === 0) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const card = document.createElement("div");
    card.className = "memberCard"; makeDraggable(card);
restorePositions(); // In case others were already saved
saveCardPositionOnDrag(card);

    // Apply hard vertical split background
    let bg = "";
    if (colors.length === 1) {
      bg = colors[0];
    } else {
      const stops = colors.map((c, i) => {
        const percent = (i / colors.length) * 100;
        const next = ((i + 1) / colors.length) * 100;
        return `${c} ${percent}%, ${c} ${next}%`;
      }).join(", ");
      bg = `linear-gradient(to right, ${stops})`;
    }

    card.style.background = bg;

    const img = document.createElement("img");
    img.src = event.target.result;
    card.appendChild(img);

    const nameDiv = document.createElement("div");
    nameDiv.className = "name";
    nameDiv.textContent = name;
    card.appendChild(nameDiv);

    document.getElementById("treeCanvas").appendChild(card);
  };

  reader.readAsDataURL(imageFile);
  document.getElementById("memberForm").reset();
});

// Make cards draggable
function makeDraggable(card) {
  let offsetX, offsetY, isDragging = false;

  card.style.position = "absolute"; // Allows free positioning
  card.style.cursor = "move";

  card.addEventListener("mousedown", function (e) {
    isDragging = true;
    offsetX = e.clientX - card.getBoundingClientRect().left;
    offsetY = e.clientY - card.getBoundingClientRect().top;
    card.style.zIndex = 1000; // bring to front
  });

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    const canvas = document.getElementById("treeCanvas");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
    card.style.zIndex = "";
  });
}
function saveCardPositionOnDrag(card) {
  card.addEventListener("mouseup", () => {
    const id = card.dataset.id;
    const pos = {
      left: card.style.left,
      top: card.style.top
    };
    let saved = JSON.parse(localStorage.getItem("positions") || "{}");
    saved[id] = pos;
    localStorage.setItem("positions", JSON.stringify(saved));
  });
}

function restorePositions() {
  const saved = JSON.parse(localStorage.getItem("positions") || "{}");
  Object.entries(saved).forEach(([id, pos]) => {
    const card = document.querySelector(`.memberCard[data-id="${id}"]`);
    if (card && pos.left && pos.top) {
      card.style.position = "absolute";
      card.style.left = pos.left;
      card.style.top = pos.top;
    }
  });
}
card.dataset.id = `card-${Date.now()}`;

function drawConnection(card1, card2) {
  const canvas = document.getElementById("connectionCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!card1 || !card2) return;

  const rect1 = card1.getBoundingClientRect();
  const rect2 = card2.getBoundingClientRect();

  const startX = rect1.left + rect1.width / 2;
  const startY = rect1.top + rect1.height / 2;
  const endX = rect2.left + rect2.width / 2;
  const endY = rect2.top + rect2.height / 2;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.stroke();
}
