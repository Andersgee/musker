import type { IconProps } from ".";

export function IconExplore({ className, width = 24, height = 24, ...rest }: IconProps) {
  return (
    <svg
      fill="none"
      strokeWidth="20"
      stroke="currentColor"
      viewBox="0 0 240 240"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
      className={className}
    >
      <path transform="rotate(135,103,103)" d="M 103 28 a 75 75 0 0 1 0 150 a 75 75 0 0 1 0 -150 v -82" />
    </svg>
  );
}
