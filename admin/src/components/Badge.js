import React from "react";

export default function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-secondary text-secondary-foreground border-border/50",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    danger: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
  };

  return (
    <span className={`inline-flex items-center text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${styles[variant]}`}>
      {children}
    </span>
  );
}
