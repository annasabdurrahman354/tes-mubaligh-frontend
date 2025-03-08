import React from "react";
import { Card, CardBody } from "@heroui/react";
import { LucideIcon, Circle, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof icons;
  color: "primary" | "success" | "danger" | "warning" | "secondary";
}

const icons: Record<string, LucideIcon> = {
  circle: Circle,
  check: CheckCircle,
  alert: AlertCircle,
  error: XCircle,
  info: Info,
};

export function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary-50 text-primary",
    success: "bg-success-50 text-success",
    danger: "bg-danger-50 text-danger",
    warning: "bg-warning-50 text-warning",
    secondary: "bg-secondary-50 text-secondary",
  };

  const IconComponent = icons[icon] || Circle; // Default to Circle if icon not found

  return (
    <Card shadow="sm" className="border-none">
      <CardBody className="flex flex-row items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <IconComponent width={24} height={24} />
        </div>
        <div>
          <p className="text-small text-default-500">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}
