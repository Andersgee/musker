import type { IconProps } from "./index";

export function IconPerson({ className, width = 48, height = 48, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} width={width} height={height} {...rest}>
      <circle cx="12" cy="8" r="4" />
      <path d="M12 12 m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}
