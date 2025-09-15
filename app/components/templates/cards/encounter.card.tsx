type EncounterCardProps = {
  date: string; // pass ISO date string or any parsable date
  children?: React.ReactNode;
};

export function EncounterCard({ date, children }: EncounterCardProps) {
  const d = new Date(date);

  const year = d.getFullYear();
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" }); // e.g., Aug
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // 03:48 PM

  return (
    <div className="flex bg-white rounded-lg shadow overflow-hidden">
      {/* Left Date Sidebar */}
      <div className="bg-teal-700 text-white flex flex-col items-center justify-between px-3 py-4 w-20">
        <div className="text-center">
          <p className="text-xs">{year}</p>
          <p className="text-xl font-bold">{day}</p>
          <p className="text-xs uppercase">{month}</p>
        </div>
        <p className="text-xs">{time}</p>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
