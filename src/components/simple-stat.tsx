import type { CardProps } from "@heroui/react";
import type { LucideIcon } from "lucide-react";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { cn } from "@heroui/react";

export type ActionCardProps = CardProps & {
  icon: LucideIcon;
  title: string;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  description: string;
  isPressable?: boolean;
  onClick?: () => void;
};

const SimpleStat = React.forwardRef<HTMLDivElement, ActionCardProps>(
  (
    {
      color,
      title,
      icon: Icon,
      description,
      isPressable = false,
      onClick,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const colors = React.useMemo(() => {
      switch (color) {
        case "primary":
          return {
            card: isPressable ? "border-primary-100" : "border-transparent",
            iconWrapper: "bg-primary-50 border-primary-100",
            icon: "text-primary",
          };
        case "secondary":
          return {
            card: isPressable ? "border-secondary-100" : "border-transparent",
            iconWrapper: "bg-secondary-50 border-secondary-100",
            icon: "text-secondary",
          };
        case "success":
          return {
            card: isPressable ? "border-success-100" : "border-transparent",
            iconWrapper: "bg-success-50 border-success-100",
            icon: "text-success",
          };
        case "warning":
          return {
            card: isPressable ? "border-warning-100" : "border-transparent",
            iconWrapper: "bg-warning-50 border-warning-100",
            icon: "text-warning-600",
          };
        case "danger":
          return {
            card: isPressable ? "border-danger-100" : "border-transparent",
            iconWrapper: "bg-danger-50 border-danger-100",
            icon: "text-danger",
          };
        default:
          return {
            card: isPressable ? "border-default-100" : "border-transparent",
            iconWrapper: "bg-default-50 border-default-100",
            icon: "text-default-500",
          };
      }
    }, [color, isPressable]);

    return (
      <Card
        ref={ref}
        className={cn("border-small w-full", colors?.card, className)}
        isPressable={isPressable}
        shadow="sm"
        onPress={onClick}
        {...props}
      >
        <CardBody className="flex h-full flex-row items-start gap-3 p-4 w-full">
          <div
            className={cn(
              "item-center flex rounded-medium border p-2",
              colors?.iconWrapper,
            )}
          >
            <Icon className={cn(colors?.icon, "h-6 w-6")} />
          </div>
          <div className="flex flex-col">
            <p className="text-medium">{title}</p>
            <p className="text-small text-default-500">
              {description || children}
            </p>
          </div>
        </CardBody>
      </Card>
    );
  },
);

SimpleStat.displayName = "SimpleStat";

export default SimpleStat;
