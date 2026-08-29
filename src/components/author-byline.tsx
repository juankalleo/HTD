export function AuthorByline({ autor, cargo, data }: { autor: string; cargo: string; data: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        {autor
          .split(" ")
          .map((parte) => parte[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div className="text-sm">
        <div className="font-semibold text-slate-900">{autor}</div>
        <div className="text-slate-500">
          {cargo} · {data}
        </div>
      </div>
    </div>
  );
}
