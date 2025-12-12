import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

export default function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <Card
      className={cn(
        "rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-xl",
        "shadow-[0_4px_18px_-4px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all duration-200",
        "p-5"
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-4 w-4 text-black" />
        <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
          {title}
        </span>
      </div>

      <div className="leading-tight">
        <span className="text-3xl font-semibold text-gray-900 leading-snug break-all">
          {value}
        </span>
      </div>
    </Card>
  );
}