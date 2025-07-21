import { useEffect, useState } from "react";
import { getIndices } from "../api/upload/api";

type Index = { id: string; name: string };

export default function IndexList({
  onSelect,
  selectedId,
}: {
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  const [indices, setIndices] = useState<Index[]>([]);

  useEffect(() => {
    getIndices().then(setIndices);
  }, []);

  return (
    <ul className="space-y-3 pr-2">
      {indices.map((index) => (
        <li key={index.id}>
          <button
            onClick={() => onSelect(index.id)}
            className={
              "w-full text-left rounded-lg px-6 py-4 min-h-[56px] transition border break-words text-sm flex items-center " +
              (selectedId === index.id
                ? "bg-white border-gray-200 font-semibold text-gray-900 shadow"
                : "bg-transparent border-transparent text-gray-400 hover:bg-gray-100")
            }
            style={{ minWidth: "180px", maxWidth: "100%", width: "100%" }} // optional: control width
          >
            <div className={selectedId === index.id ? "" : "font-semibold text-gray-700"}>
              {index.name}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}