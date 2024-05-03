import { cn } from "@/utils/cn";
import React from "react";
import { IoSearch } from "react-icons/io5";

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBox(props: Props) {
  return (
    <form
      onSubmit={props.onSubmit}
      className={cn(
        "relative flex h-10 items-center justify-center",
        props.className
      )}
    >
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search location.."
        className="h-full w-[230px] rounded-l-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />
      <button className="h-full rounded-r-md bg-orange-500 px-4 py-[9px] text-white hover:bg-orange-600 focus:outline-none">
        <IoSearch />
      </button>
    </form>
  );
}
