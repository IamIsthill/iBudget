import { View } from "react-native";
import { KeyItem } from "./KeyItem";
import { useTransactionContext } from "../context/TransactionContext";

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "backspace"],
];

export function KeypadArea() {
  const { changeAmount, draft } = useTransactionContext();

  function handleKeyPress(key: string) {
    if (key === "backspace") {
      changeAmount(draft.amount.slice(0, -1));
      return;
    }
    if (key === "." && draft.amount === "") {
      changeAmount("0.");
      return;
    }
    if (key === ".") {
      if (draft.amount.includes(".")) return;
      changeAmount(draft.amount + ".");
      return;
    }
    if (draft.amount === "0" && key === "0") return;
    if (draft.amount === "0" && key !== "0") {
      changeAmount(key);
      return;
    }
    if (draft.amount.includes(".")) {
      const [, dec] = draft.amount.split(".");
      if (dec?.length >= 2) return;
    }

    if (draft.amount.length >= 10) return;
    changeAmount(draft.amount + key);
  }
  return (
    <View>
      {KEYS.map((keyRow, rowIndex) => (
        <View key={rowIndex} className="flex-row">
          {keyRow.map((key) => (
            <KeyItem
              key={key}
              label={key}
              onKeyPress={() => handleKeyPress(key)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
