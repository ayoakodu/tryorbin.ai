const KEY = 'orbin_sequences';

export function loadSequences() {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export function saveSequences(sequences) {
  try {
    localStorage.setItem(KEY, JSON.stringify(sequences));
  } catch {}
}

export function getSequence(id) {
  const seqs = loadSequences() || [];
  return seqs.find(s => s.id === id) || null;
}

export function upsertSequence(seq) {
  const seqs = loadSequences() || [];
  const idx = seqs.findIndex(s => s.id === seq.id);
  if (idx >= 0) seqs[idx] = seq;
  else seqs.push(seq);
  saveSequences(seqs);
}
