import { useEffect, useState } from "react";
import Keyboard from "./Keyboard";
import wordles from "./wordles";
import valid from "./valid";

const App = () => {
  const [word] = useState(() =>
    wordles[Math.floor(Math.random() * wordles.length)].toUpperCase()
  );
  const [guess, setGuess] = useState("");
  const [grid, setGrid] = useState(
    Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => ""))
  );
  const [colors, setColors] = useState(
    Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => "#fff"))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentRow > 5) return;
      if (guess === word) return;
      const key = e.key;

      if (/^[a-zA-Z]$/.test(key)) {
        setGrid((prev) => {
          if (currentCol > 4) return prev;

          const newGrid = prev.map((row) => [...row]);
          newGrid[currentRow][currentCol] = key.toUpperCase();

          return newGrid;
        });

        setCurrentCol((col) => Math.min(col + 1, 5));
      }

      if (key === "Backspace") {
        setGrid((prev) => {
          if (currentCol === 0) return prev;

          const newGrid = prev.map((row) => [...row]);
          newGrid[currentRow][currentCol - 1] = "";
          return newGrid;
        });

        setCurrentCol((col) => Math.max(col - 1, 0));
      }

      if (key === "Enter" && currentCol === 5) {
        if (
          !(
            valid.includes(grid[currentRow].join("").toLowerCase()) ||
            wordles.includes(grid[currentRow].join("").toLowerCase())
          )
        ) {
          setMessage("NOT A VALID WORD");
          setTimeout(() => {
            setMessage("");
          }, 500);
          return;
        }

        const guess = grid[currentRow];
        if (guess.join("") === word) {
          setMessage("YOU WIN!");
        }
        if (guess.join("") !== word && currentRow === 5) {
          setMessage(`${word} WAS THE WORD`);
        }

        setColors((prevColors) => {
          const newColors = prevColors.map((row) => [...row]);
          setGuess(guess.join(""));
          const wordLetterCount: Record<string, number> = {};
          for (const letter of word) {
            wordLetterCount[letter] = (wordLetterCount[letter] || 0) + 1;
          }

          guess.forEach((letter, i) => {
            if (letter === word[i]) {
              newColors[currentRow][i] = "green";
              wordLetterCount[letter]--;
            }
          });

          guess.forEach((letter, i) => {
            if (newColors[currentRow][i] === "green") return;
            if (word.includes(letter) && wordLetterCount[letter] > 0) {
              newColors[currentRow][i] = "goldenrod";
              wordLetterCount[letter]--;
            } else {
              newColors[currentRow][i] = "#787C7E";
            }
          });

          return newColors;
        });
        setCurrentRow((r) => r + 1);
        setCurrentCol(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentRow, currentCol, grid, word, guess]);

  return (
    <>
      <style>{`
        @keyframes flip {
          0% {
            transform: rotateX(0);
          }
          50% {
            transform: rotateX(-90deg);
          }
          100% {
            transform: rotateX(0);
          }
        }

        @keyframes bounce {
          0%, 20% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          50% {
            transform: translateY(5px);
          }
          60% {
            transform: translateY(-15px);
          }
          80% {
            transform: translateY(2px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .flip {
          animation: flip 350ms ease-in-out forwards;
        }

        .flip-then-bounce {
          animation: flip 350ms ease-in-out forwards, bounce 1000ms ease-in-out forwards;
        }
      `}</style>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {<h1 style={{ height: "40px" }}>{message}</h1>}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 62px)",
            rowGap: "6px",
            columnGap: "10px",
          }}
        >
          {grid.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
              const submittedRow = currentRow - 1;
              const isActiveRow = rowIndex === submittedRow;
              const isWinRow = isActiveRow && guess === word;

              const flipDuration = 350;
              const flipStagger = 150;
              const bounceStagger = 100;

              let className = "";
              let animationDelay = "0ms";

              if (isActiveRow) {
                if (isWinRow) {
                  className = "flip-then-bounce";
                  const flipDelay = cellIndex * flipStagger;
                  const bounceDelay =
                    flipDuration + flipStagger * 4 + bounceStagger * cellIndex;
                  animationDelay = `${flipDelay}ms, ${bounceDelay}ms`;
                } else {
                  className = "flip";
                  animationDelay = `${cellIndex * flipStagger}ms`;
                }
              }

              return (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  className={className}
                  style={{
                    animationDelay,
                    border:
                      rowIndex < currentRow
                        ? "2px solid transparent"
                        : "2px solid #d3d6da",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "62px",
                    width: "62px",
                    backgroundColor: colors[rowIndex][cellIndex],
                    fontSize: "32px",
                    fontFamily: "Clear Sans",
                    fontWeight: "bold",
                    color:
                      colors[rowIndex][cellIndex] === "#fff" ? "#000" : "#fff",
                  }}
                >
                  {cell}
                </div>
              );
            });
          })}
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Keyboard
            grid={grid}
            colors={colors}
            currentRow={currentRow}
            onKeyPress={(key) =>
              window.dispatchEvent(new KeyboardEvent("keydown", { key }))
            }
          />
        </div>
      </div>
    </>
  );
};

export default App;
