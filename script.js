const svg = document.getElementById("tree");
const elk = new ELK();

let sims = []; // store all sims in memory

fetch("sims.json")
  .then(res => res.json())
  .then(data => {
    sims = data.sims;
    renderTree();
  });

// ------------------------
// ADD SIM FORM LOGIC
// ------------------------

document.getElementById("sim-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("sim-name").value.trim();
  const gender = document.getElementById("sim-gender").value;
  const id = document.getElementById("sim-id").value.trim();

  // Basic ID validation
  if (sims.some(sim => sim.id === id)) {
    alert("A Sim with this ID already exists!");
    return;
  }

  const newSim = {
    id,
    name,
    gender,
    children: [],
    spouses: []
  };

  sims.push(newSim);
  renderTree();

  // Reset form
  e.target.reset();
});

// ------------------------
// RENDER LOGIC
// ------------------------

function renderTree() {
  const nodes = sims.map(sim => ({
    id: sim.id,
    width: 100,
    height: 50,
    label: sim.name
  }));

  const edges = buildEdges(sims).map(edge => ({
    id: `${edge.source}->${edge.target}`,
    sources: [edge.source],
    targets: [edge.target]
  }));

  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered"
    },
    children: nodes,
    edges: edges
  };

  elk.layout(graph).then(drawGraph);
}

function buildEdges(sims) {
  const edges = [];
  sims.forEach(sim => {
    (sim.children || []).forEach(childId => {
      edges.push({ source: sim.id, target: childId });
    });
    (sim.spouses || []).forEach(spouseId => {
      edges.push({ source: sim.id, target: spouseId });
    });
  });
  return edges;
}

function drawGraph(graph) {
  svg.innerHTML = `
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#666" />
      </marker>
    </defs>
  `;

  graph.edges.forEach(edge => {
    const src = graph.children.find(n => n.id === edge.sources[0]);
    const tgt = graph.children.find(n => n.id === edge.targets[0]);

    const x1 = src.x + src.width / 2;
    const y1 = src.y + src.height;
    const x2 = tgt.x + tgt.width / 2;
    const y2 = tgt.y;

    const path = `M${x1},${y1} L${x2},${y2}`;
    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d", path);
    pathEl.setAttribute("class", "edge");
    svg.appendChild(pathEl);
  });

  graph.children.forEach(node => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "node");
    group.setAttribute("transform", `translate(${node.x},${node.y})`);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", node.width);
    rect.setAttribute("height", node.height);
    group.appendChild(rect);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", node.width / 2);
    text.setAttribute("y", node.height / 2 + 5);
    text.textContent = node.label || node.id;
    group.appendChild(text);

    svg.appendChild(group);
  });
}
