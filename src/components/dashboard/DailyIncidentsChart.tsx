import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IncidentStats } from '@/types/incident';
import { format, parseISO } from 'date-fns';

interface DailyIncidentsChartProps {
  stats: IncidentStats;
}

export function DailyIncidentsChart({ stats }: DailyIncidentsChartProps) {
  const data = stats.byDay.map((item) => ({
    date: format(parseISO(item.date), 'MMM dd'),
    count: item.count,
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Incidents - Last 7 Days</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
