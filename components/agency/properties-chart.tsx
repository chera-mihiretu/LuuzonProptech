"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PropertiesChartProps {
  data: Array<{
    month: string;
    listed: number;
    rented: number;
  }>;
}

export function PropertiesChart({ data }: PropertiesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties Status</CardTitle>
        <CardDescription>Listed vs Rented Properties (Last 6 Months)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Bar
              dataKey="listed"
              fill="#000000" /* black */
              stroke="#111827" /* near-black */
              name="Listed"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="rented"
              fill="#9ca3af" /* gray-400 */
              stroke="#6b7280" /* gray-500 */
              name="Rented"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


