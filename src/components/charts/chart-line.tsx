'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface IChartLine {
  data: { date: string; l1: number; l2?: number; l3?: number; l4?: number; l5?: number }[];
  labels: string[];
  colors?: string[];
  title: string;
  description?: string;
  tickLine?: boolean;
}

export function ChartLine({ data, labels, colors = [], title, description, tickLine = true }: IChartLine) {
  const chartConfig = {
    l1: {
      label: labels[0],
      color: colors[0] ? `var(${colors[0]})` : 'var(--chart-1)',
    },
    l2: {
      label: labels[1],
      color: colors[1] ? `var(${colors[1]})` : 'var(--chart-2)',
    },
    l3: {
      label: labels[2],
      color: colors[2] ? `var(${colors[2]})` : 'var(--chart-3)',
    },
    l4: {
      label: labels[3],
      color: colors[3] ? `var(${colors[3]})` : 'var(--chart-4)',
    },
    l5: {
      label: labels[4],
      color: colors[4] ? `var(${colors[4]})` : 'var(--chart-5)',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={tickLine} axisLine={false} tickMargin={8} />
            <YAxis tickLine={tickLine} axisLine={false} tickMargin={8} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Line dataKey="l1" type="monotone" stroke="var(--color-l1)" strokeWidth={2} dot={false} />
            {labels[1] && <Line dataKey="l2" type="monotone" stroke="var(--color-l2)" strokeWidth={2} dot={false} />}
            {labels[2] && <Line dataKey="l3" type="monotone" stroke="var(--color-l3)" strokeWidth={2} dot={false} />}
            {labels[3] && <Line dataKey="l4" type="monotone" stroke="var(--color-l4)" strokeWidth={2} dot={false} />}
            {labels[4] && <Line dataKey="l5" type="monotone" stroke="var(--color-l5)" strokeWidth={2} dot={false} />}

            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
