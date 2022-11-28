type Props = {
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, className = "", ...rest }: Props) {
  return (
    <button
      className={`rounded-full bg-sky-500 px-3 py-2 font-bold text-white disabled:bg-sky-300 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
