const svg = document.getElementById("tree");
const elk = new ELK();

fetch("sims.json")
  .then(res => res.json())
  .then(data => {
    const nodes = data.sims.map(sim => ({
      id: sim.id,
      width: 100,
      height: 50,
      label: sim.name
    }));

    const edges = buildEdges(data.sims).map(edge => ({
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

    elk.layout(graph).then(layout => {
      drawGraph(layout);
    });
  });

function buildEdges(sims) {
  const edges = [];
  sims.forEach(sim => {
    (sim.children || []).forEach(childId => {
      edges.push({ source: sim.id, target: childId, type: "parent" });
    });

    (sim.spouses || []).forEach(spouseId => {
      edges.push({ source: sim.id, target: spouseId, type: "spouse" });
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

  // Draw edges
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

  // Draw nodes
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

