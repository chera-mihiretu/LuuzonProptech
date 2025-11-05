"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ActiveUsersChartProps {
  data: Array<{
    day: string;
    active: number;
  }>;
}

export function ActiveUsersChart({ data }: ActiveUsersChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Users</CardTitle>
        <CardDescription>Last 7 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="day"
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
            <Line
              type="monotone"
              dataKey="active"
              stroke="hsl(var(--chart-5))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-5))", r: 4 }}
              activeDot={{ r: 6 }}
              name="Active"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


