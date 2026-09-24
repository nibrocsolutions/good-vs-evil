export function References({ citations }: { citations: string[] }) {
  return (
    <ul className="refs">
      {citations.map((citation) => (
        <li key={citation}>{citation}</li>
      ))}
    </ul>
  );
}
