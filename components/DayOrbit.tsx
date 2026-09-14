"use client";

interface DayOrbitProps {
  progress: number;
  hourProgress: number;
  activeCount: number;
  completedCount: number;
  greeting: string;
  dateLabel: string;
}

/** Circular day dial — completion ring + hour hand of the day. */
export default function DayOrbit({
  progress,
  hourProgress,
  activeCount,
  completedCount,
  greeting,
  dateLabel,
}: DayOrbitProps) {
  const size = 220;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const completedOffset = circumference * (1 - progress);
  const hourAngle = hourProgress * 360 - 90;

  return (
    <section className="orbit" aria-label="Day progress">
      <div className="orbit__copy">
        <p className="orbit__greeting">{greeting}</p>
        <h1 className="orbit__brand">Daybook</h1>
        <p className="orbit__date">{dateLabel}</p>
        <p className="orbit__summary">
          <span>{activeCount} open</span>
          <span className="orbit__dot" aria-hidden="true" />
          <span>{completedCount} done</span>
        </p>
      </div>

      <div className="orbit__dial" role="img" aria-label={`${Math.round(progress * 100)} percent of tasks complete`}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="orbit__svg">
          <circle
            className="orbit__track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
          />
          <circle
            className="orbit__progress"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={completedOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          <line
            className="orbit__hand"
            x1={size / 2}
            y1={size / 2}
            x2={size / 2 + Math.cos((hourAngle * Math.PI) / 180) * (radius - 18)}
            y2={size / 2 + Math.sin((hourAngle * Math.PI) / 180) * (radius - 18)}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle className="orbit__hub" cx={size / 2} cy={size / 2} r="5" />
        </svg>
        <div className="orbit__percent">
          <span className="orbit__percent-value">{Math.round(progress * 100)}</span>
          <span className="orbit__percent-label">done</span>
        </div>
      </div>
    </section>
  );
}
