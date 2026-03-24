import { FaSpinner } from "react-icons/fa";

interface LoaderProps {
  message?: string;
}

export function Loader({ message = "Loading..." }: LoaderProps) {
  return (
    <div className="loading flex justify-center items-center gap-2">
      <FaSpinner className="icon w-6 h-6 animate-spin text-zinc-700 dark:text-zinc-200" />
      <span className="text-zinc-700 dark:text-zinc-200">{message}</span>
    </div>
  );
}
