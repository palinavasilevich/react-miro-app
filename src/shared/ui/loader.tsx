import { FaSpinner } from "react-icons/fa";

interface LoaderProps {
  text?: string;
}

export function Loader({ text = "Loading..." }: LoaderProps) {
  return (
    <div className="loading flex justify-center items-center gap-2">
      <FaSpinner className="icon w-6 h-6 animate-spin text-zinc-700 dark:text-zinc-200" />
      <span className="text-zinc-700 dark:text-zinc-200">{text}</span>
    </div>
  );
}
