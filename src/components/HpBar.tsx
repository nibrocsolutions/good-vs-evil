export function HpBar({
  hp,
  maxHp,
  tone,
  label,
}: {
  hp: number;
  maxHp: number;
  tone: "good" | "evil";
  label: string;
}) {
  const safeMax = Math.max(1, maxHp);
  const pct = Math.max(0, Math.min(100, (hp / safeMax) * 100));
  return (
    <div
      className={`hp hp-${tone}`}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={Math.max(0, hp)}
    >
      <div className="hp-fill" style={{ width: `${pct}%` }} />
      <span className="hp-label">
        {Math.max(0, hp)} / {safeMax}
      </span>
    </div>
  );
}
