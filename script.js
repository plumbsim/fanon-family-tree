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
    card.className = "memberCard";

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
