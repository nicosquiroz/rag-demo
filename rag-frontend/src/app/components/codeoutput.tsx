export default function CodeOutput({ code }: { code: string }) {
    return (
      <div className="mt-4 p-4 bg-gray-100 border rounded">
        <h3 className="font-bold mb-2">Código Generado</h3>
        <pre className="whitespace-pre-wrap font-mono text-sm">{code}</pre>
      </div>
    );
  }