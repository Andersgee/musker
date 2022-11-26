import type { IconProps } from ".";

export function IconHome({ className, width = 24, height = 24, ...rest }: IconProps) {
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
        stroke="currentColor"
        d="M 10 97 l 110 -67 l 110 67 M 200 80 v 115 a 15 15 0 0 1 -15 15 h -130a 15 15 0 0 1 -15 -15 v -115 M 120 100a 30 30 0 0 1 0 60 a 30 30 0 0 1 0 -60"
      />
    </svg>
  );
}
