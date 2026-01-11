
interface ProjectBadgeProps {
  text: string;
  color?: string;
}

export default function ProjectBadge({ text, color = "blue" }: ProjectBadgeProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  };

  const colorClass = colorMap[color] || colorMap.blue;

  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase border rounded-full ${colorClass}`}>
      {text}
    </span>
  );
}
