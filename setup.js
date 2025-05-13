const chart_config = {
  chart: {
    container: "#tree-simple",
    rootOrientation: "NORTH", // Top-down
    nodeAlign: "BOTTOM",
    connectors: { type: 'step' },
    levelSeparation: 50,
    siblingSeparation: 40,
    subTeeSeparation: 60
  },
  nodeStructure: {
    text: { name: "Grandparent" },
    children: [
      {
        text: { name: "Parent A" },
        children: [
          { text: { name: "Child 1" } },
          { text: { name: "Child 2" } }
        ]
      },
      {
        text: { name: "Parent B" },
        children: [
          { text: { name: "Child 3" } }
        ]
      }
    ]
  }
};

new Treant(chart_config);
