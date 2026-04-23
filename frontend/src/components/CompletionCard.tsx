type Props = {
  completed: number;
  total: number;
  percentage: number;
  icon: string;
};

export function CompletionCard({
  completed,
  total,
  percentage,
  icon,
}: Props) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full max-w-5xl bg-white rounded-xl shadow p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={icon} className="w-10 h-10" />

        <div>
          <p className="text-sm text-gray-500">
            Habits Completed Today
          </p>
          <p className="font-semibold text-lg">
            {completed} / {total}
          </p>
        </div>
      </div>

      <div className="relative w-16 h-16">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 36 36"
        >
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            strokeWidth="3"
            className="stroke-gray-200"
          />

          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="stroke-indigo-400 transition-all duration-500 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-indigo-500">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}