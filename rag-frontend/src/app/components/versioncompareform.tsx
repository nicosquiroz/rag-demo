import { useEffect, useState } from "react";
import { getVersionContent, compare } from "../api/upload/api";

export default function VersionCompareForm({ versionIds, onResult }: { versionIds: [string, string]; onResult: (code: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const [v1, v2] = await Promise.all([
      getVersionContent(versionIds[0]),
      getVersionContent(versionIds[1]),
    ]);
    const result = await compare(v1.content, v2.content);
    onResult(result.code);
    setLoading(false);
  };

  return (
    <button onClick={handleGenerate} disabled={loading} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
      {loading ? "Generando..." : "Comparar y Generar Código"}
    </button>
  );
}
