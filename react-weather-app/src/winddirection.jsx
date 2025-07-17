function getWindDirection(degree) {
    const directions = [
      { dir: "N", arrow: "↑" },
      { dir: "NE", arrow: "↗️" },
      { dir: "E", arrow: "→" },
      { dir: "SE", arrow: "↘️" },
      { dir: "S", arrow: "↓" },
      { dir: "SW", arrow: "↙️" },
      { dir: "W", arrow: "←" },
      { dir: "NW", arrow: "↖️" },
    ];
  
    const index = Math.round(degree / 45) % 8;
    const { dir, arrow } = directions[index];
    return `${arrow} ${dir}`; // Example: ↖️ NW
  }
  
  export default getWindDirection;