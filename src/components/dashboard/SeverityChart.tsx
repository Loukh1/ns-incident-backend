import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { IncidentStats } from '@/types/incident';

interface SeverityChartProps {
  stats: IncidentStats;
}

const COLORS = {
  CRITICAL: 'hsl(var(--critical))',
  HIGH: 'hsl(var(--high))',
  Warning: 'hsl(var(--warning))',
  MEDIUM: 'hsl(var(--medium))',
  LOW: 'hsl(var(--low))',
};

export function SeverityChart({ stats }: SeverityChartProps) {
  const data = stats.bySeverity.map((item) => ({
    name: item.severity,
    value: item.count,
    percentage: ((item.count / stats.total) * 100).toFixed(1),
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Incidents by Severity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [value, 'Count']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
