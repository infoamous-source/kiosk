import { Clock } from 'lucide-react';

interface CountdownBadgeProps {
  days: number;
  className?: string;
}

export default function CountdownBadge({ days, className = '' }: CountdownBadgeProps) {
  const getColor = () => {
    if (days <= 7) return 'text-red-600 bg-red-50 border-red-200';
    if (days <= 30) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${getColor()} ${className}`}>
      <Clock className="w-3.5 h-3.5" />
      <span>D-{days}</span>
    </div>
  );
}
