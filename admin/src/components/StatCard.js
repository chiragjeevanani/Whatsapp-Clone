import React from "react";

export default function StatCard({ title, value, change, icon: Icon }) {
  const isNegative = change && change.startsWith("-");
  const isNeutral = change && !change.startsWith("+") && !change.startsWith("-");
  
  return (
    <div className="glass-card p-5 rounded-xl border border-border flex flex-col justify-between min-h-[120px] select-none bg-card text-foreground">
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center border border-border/50">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2.5">
        <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
        {change && (
          <span className={`text-xs font-bold ${
            isNegative 
              ? "text-destructive" 
              : isNeutral 
                ? "text-muted-foreground" 
                : "text-emerald-500"
          }`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
