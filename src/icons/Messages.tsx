import type { IconProps } from ".";

export function IconMessages({ className, width = 24, height = 24, ...rest }: IconProps) {
  return (
    <svg
      fill="none"
      strokeWidth="20"
      stroke="currentColor"
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      {...rest}
      className={className}
    >
      <path
        fill="none"
        d="M 45 40 h 150 a 15 15 0 0 1 15 15 v 130 a 15 15 0 0 1 -15 15 h -150 a 15 15 0 0 1 -15 -15 v -130 a 15 15 0 0 1 15 -15 M 35 90 l 85 40 l 85 -40"
      />
    </svg>
  );
}
