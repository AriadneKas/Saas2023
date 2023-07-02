const backgroundColor = [
    // Random colors
    ...Array.from({ length: 12 }, () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 0.35)`;
    })
  ];

  console.log(backgroundColor);