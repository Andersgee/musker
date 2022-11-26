import type { IconProps } from ".";

export function Stars({ className, width = 24, height = 24, ...rest }: IconProps) {
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
        strokeWidth="20"
        stroke="currentColor"
        d=" M 130 20 q 0 100 100 100 q -100 0 -100 100 q 0 -100 -100 -100 q 100 0 100 -100"
      />
      <path
        fill="black"
        strokeWidth="10"
        stroke="currentColor"
        d="M 55 10 q 0 35 35 35 q -35 0 -35 35 q 0 -35 -35 -35 q 35 0 35 -35"
      />
    </svg>
  );
}
