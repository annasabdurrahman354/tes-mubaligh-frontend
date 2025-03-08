import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BarChartProps {
  data: Array<{
    name: string;
    [key: string]: any;
  }>;
  keys: Array<{
    key: string;
    color: string;
    name: string;
  }>;
  title: string;
}

export function BarChart({ data, keys, title }: BarChartProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-medium font-medium mb-2">{title}</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((item) => (
              <Bar key={item.key} dataKey={item.key} name={item.name} fill={item.color} />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}