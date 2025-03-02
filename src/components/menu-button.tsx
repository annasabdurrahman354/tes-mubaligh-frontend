import type { CardProps } from "@heroui/react";
import type { LucideIcon } from "lucide-react";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { cn } from "@heroui/react";
import { ChevronRight } from "lucide-react";

export type ActionCardProps = CardProps & {
  icon: LucideIcon;
  title: string;
  color?: "primary" | "secondary" | "warning" | "danger";
  isPressable?: boolean;
  onClick?: () => void;
};

const MenutButton = React.forwardRef<HTMLDivElement, ActionCardProps>(
  (
    {
      color,
      title,
      icon: Icon,
      isPressable = false,
      onClick,
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
        radius="sm"
        shadow="sm"
        onPress={onClick}
        {...props}
      >
        <CardBody className="flex h-full flex-row items-center justify-between gap-3 p-4 w-full">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "item-center flex rounded-medium border p-2",
                colors?.iconWrapper,
              )}
            >
              <Icon className={cn(colors?.icon, "h-6 w-6")} />
            </div>
            <div className="flex flex-col">
              <p
                className={cn(
                  "text-medium dark:text-default-foreground",
                  `text-${color}`,
                )}
              >
                {title}
              </p>
            </div>
          </div>
          <ChevronRight className={cn("h-5 w-5", `text-${color}`)} />
        </CardBody>
      </Card>
    );
  },
);

MenutButton.displayName = "MenutButton";

export default MenutButton;
