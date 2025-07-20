// API utility functions for backend communication

export async function getIndices() {
  const res = await fetch('http://127.0.0.1:8000/indices');
  return res.json();
}

export async function getVersions(indexId: string) {
  const res = await fetch(`http://127.0.0.1:8000/indices/${indexId}/versions`);
  return res.json();
}

export async function getVersionContent(versionId: string) {
  const res = await fetch(`http://127.0.0.1:8000/versions/${versionId}`);
  return res.json();
}

export async function compare(contentA: string, contentB: string) {
  // Placeholder: implement your code generation logic or endpoint
  // For now, just return a dummy response
  return { code: `# Diff between versions\n${contentA}\n---\n${contentB}` };
}
