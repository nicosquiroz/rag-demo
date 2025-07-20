import { useEffect, useState } from "react";
import { getVersions } from "../api/upload/api";

export default function VersionList({ indexId, onSelectPair }: { indexId: string; onSelectPair: (ids: [string, string]) => void }) {
  const [versions, setVersions] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    getVersions(indexId).then(setVersions);
    setSelected([]);
  }, [indexId]);

  const toggleSelect = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id].slice(-2);
    setSelected(next);
    if (next.length === 2) onSelectPair([next[0], next[1]]);
  };

  return (
    <ul className="space-y-2">
      {versions.map((v: any) => (
        <li key={v.id}>
          <label>
            <input
              type="checkbox"
              checked={selected.includes(v.id)}
              onChange={() => toggleSelect(v.id)}
              className="mr-2"
            />
            {v.version_name} ({new Date(v.timestamp).toLocaleString()})
          </label>
        </li>
      ))}
    </ul>
  );
}