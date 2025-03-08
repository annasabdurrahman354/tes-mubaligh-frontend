import React from "react";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import {
  Card,
  CardProps,
  ButtonProps,
  cn,
} from "@heroui/react";

interface BarChartCardProps extends Omit<CardProps, "children"> {
  title: string;
  color: ButtonProps["color"];
  data: Array<{
    name: string;
    [key: string]: any;
  }>;
  keys: Array<{
    key: string;
    color: string;
    name: string;
  }>;
  timeRanges?: string[];
  defaultTimeRange?: string;
}

const formatTotal = (total: number) => {
  return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total;
};

export function BarChartCard({ 
  className, 
  title, 
  color, 
  data, 
  keys,
  ...props 
}: BarChartCardProps) {
  return (
    <Card
      className={cn("min-h-[300px] border border-transparent dark:border-default-100", className)}
      {...props}
    >
      <div className="flex flex-col gap-y-2 p-4 pb-0">
        <div className="flex items-center justify-between gap-x-2">
          <dt>
            <h3 className="text-small font-medium text-default-500">{title}</h3>
          </dt>
        </div>
      </div>
      <div className="flex h-full flex-col items-center justify-center p-4">
        <ResponsiveContainer 
          className="[&_.recharts-surface]:outline-none"
          width="100%" 
          height={250}
        >
          <RechartsBarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
            barGap={8}
            barSize={16}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="var(--heroui-default-200)"
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--heroui-default-500)' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--heroui-default-500)' }}
              dx={-10}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-medium bg-background p-2 shadow-md border border-default-200">
                      <p className="text-small font-medium mb-1">{label}</p>
                      {payload.map((entry, index) => (
                        <div key={`tooltip-${index}`} className="flex items-center gap-2 text-tiny">
                          <div 
                            className="h-2 w-2 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-default-600">{entry.name}: </span>
                          <span className="font-medium">{formatTotal(entry.value as number)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ 
                fill: "var(--heroui-default-100)",
                opacity: 0.5
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: "12px", paddingTop: "15px" }}
              iconType="circle"
              iconSize={8}
            />
            {keys.map((item, index) => (
              <Bar 
                key={item.key} 
                dataKey={item.key} 
                name={item.name} 
                fill={item.color}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
