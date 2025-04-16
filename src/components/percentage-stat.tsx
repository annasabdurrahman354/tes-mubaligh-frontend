import type { CardProps } from "@heroui/react";
import type { LucideIcon } from "lucide-react";

import React from "react";
import { Card, Skeleton } from "@heroui/react";
import { cn } from "@heroui/react";
import { Chip } from "@heroui/react";

export type PercentageStatProps = CardProps & {
  icon: LucideIcon;
  title: string;
  value?: number | null;
  percent?: string | null;
  desc?: string | null;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  onClick?: () => void;
  isPressable?: boolean;
};

const PercentageStat = React.forwardRef<HTMLDivElement, PercentageStatProps>(
  (
    {
      color,
      title,
      value,
      percent,
      desc,
      icon: Icon,
      onClick,
      isPressable,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "border-small",
          onClick != undefined || isPressable != undefined
            ? `border-${color}-100`
            : "border-transparent",
          className,
        )}
        isPressable={onClick != undefined}
        shadow="sm"
        onPress={onClick}
        {...props}
      >
        <div className="flex flex-col md:flex-row p-4">
          <div
            className={cn(
              "mt-1 flex h-10 w-10 items-center justify-center rounded-md",
              `bg-${color}-50`,
            )}
          >
            <Icon className={cn("h-6 w-6", `text-${color}`)} />
          </div>
          <div className="flex flex-col gap-y-1">
            <div className="md:pl-4 mr-2 mt-2 md:mt-0 text-medium text-start">
              {title}
            </div>
            <div className="flex items-center">
              {value !== undefined &&
                (value !== null ? (
                  <>
                    <div className="md:pl-4 mr-2 text-xl font-semibold text-default-800">
                      {value}
                    </div>

                    {percent && (
                      <Chip
                        classNames={{ 
                          content: "font-semibold text-[0.65rem]",
                          base: "mr-1",
                         }}
                        color="default"
                        radius="sm"
                        size="md"
                        variant="flat"
                      >
                        {percent}
                      </Chip>
                    )}
                    {desc && (
                      <Chip
                        classNames={{ content: "font-semibold text-[0.65rem]" }}
                        color={color}
                        radius="sm"
                        size="md"
                        variant="flat"
                      >
                        {desc}
                      </Chip>
                    )}
                  </>
                ) : (
                  <Skeleton className="md:ml-4 mr-2 h-6 w-full rounded-lg" />
                ))}
            </div>
          </div>
        </div>

        <div className="bg-default-100 bottom-0 w-full">
          <div
            className={cn(
              " w-full flex justify-start text-sm p-3 dark:text-default-foreground",
              `text-${color}`,
            )}
          >
            {onClick ? "Lihat ➜" : "‎ "}
          </div>
        </div>
      </Card>
    );
  },
);

PercentageStat.displayName = "PercentageStat";

export default PercentageStat;
