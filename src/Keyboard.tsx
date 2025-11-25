interface KeyboardProps {
  grid: string[][];
  colors: string[][];
  currentRow: number;
  onKeyPress: (key: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({
  grid,
  colors,
  currentRow,
  onKeyPress,
}) => {
  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
  ];

  const getKeyColor = (key: string) => {
    let keyColor = "#d3d6da";
    for (let r = 0; r < currentRow; r++) {
      const rowLetters = grid[r];
      const rowColors = colors[r];
      rowLetters.forEach((letter, idx) => {
        if (letter === key) {
          const color = rowColors[idx];
          if (color === "green") keyColor = "green";
          else if (color === "goldenrod" && keyColor !== "green")
            keyColor = "goldenrod";
          else if (
            color === "#787C7E" &&
            keyColor !== "green" &&
            keyColor !== "goldenrod"
          )
            keyColor = "#787C7E";
        }
      });
    }
    return keyColor;
  };

  return (
    <div
      style={{
        marginTop: "20px",
        width: "100%",
        maxWidth: "500px",
        padding: "0 4px",
      }}
    >
      {keyboardRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "6px",
          }}
        >
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              style={{
                height: "58px",
                minWidth:
                  key === "Enter" || key === "Backspace" ? "65px" : "43px",
                margin: "0 3px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: getKeyColor(key),
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                fontFamily: "Clear Sans",
                fontSize:
                  key === "Enter" || key === "Backspace" ? "12px" : "14px",
              }}
            >
              {key === "Backspace" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
