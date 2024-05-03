import { cn } from "@/utils/cn";
import React from "react";

export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full rounded-xl border bg-gray-200 py-4 shadow-sm",
        props.className
      )}
    />
  );
}
