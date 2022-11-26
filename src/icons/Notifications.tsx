import type { IconProps } from ".";

export function IconNotifications({ className, width = 24, height = 24, ...rest }: IconProps) {
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
      <path fill="none" d="M 40 170 l 10 -80 c 10 -80 130 -80 140 0 l 10 80 z M 160 170 a 40 40 0 0 1 -80 0" />
    </svg>
  );
}
