import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Interface for the standardized return format (keep this)
export interface SelectOption {
  value: number | string;
  label: string;
}
