document.getElementById("memberForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("nameInput").value;
  const imageFile = document.getElementById("imageInput").files[0];
  const color1 = document.getElementById("color1").value || "#444";
  const color2 = document.getElementById("color2").value || color1;
  const color3 = document.getElementById("color3").value || color2;

  if (!imageFile) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const card = document.createElement("div");
    card.className = "memberCard";
    card.style.background = `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`;

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

  // Reset form
  document.getElementById("memberForm").reset();
});
