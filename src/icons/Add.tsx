import type { IconProps } from ".";

export function IconAdd({ className, width = 24, height = 24, ...rest }: IconProps) {
  return (
    <svg
      fill="currentColor"
      strokeWidth="2"
      stroke="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      {...rest}
      className={className}
    >
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}
