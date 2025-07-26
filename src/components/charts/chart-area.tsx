'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface IChartArea {
  data: { date: string; l1: number; l2?: number; l3?: number; l4?: number; l5?: number }[];
  labels: string[];
  colors?: string[];
  title: string;
  description?: string;
  tickLine?: boolean;
}

export function ChartArea({ data, labels, colors = [], title, description, tickLine = true }: IChartArea) {
  const chartConfig = {
    l1: {
      label: labels[0],
      color: colors[0] ? `var(${colors[0]})` : 'var(--chart-1)',
    },
    l2: {
      label: labels[1],
      color: data[0]?.l2 ? (colors[1] ? `var(${colors[1]})` : 'var(--chart-2)') : undefined,
    },
    l3: {
      label: labels[2],
      color: data[0]?.l3 ? (colors[2] ? `var(${colors[2]})` : 'var(--chart-3)') : undefined,
    },
    l4: {
      label: labels[3],
      color: data[0]?.l4 ? (colors[3] ? `var(${colors[3]})` : 'var(--chart-4)') : undefined,
    },
    l5: {
      label: labels[4],
      color: data[0]?.l5 ? (colors[4] ? `var(${colors[4]})` : 'var(--chart-5)') : undefined,
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
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={tickLine} axisLine={false} tickMargin={8} tickFormatter={value => value.slice(0, 10)} />
            <YAxis dataKey="l1" tickLine={tickLine} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
            <Area dataKey="l1" type="natural" fill="var(--color-l1)" fillOpacity={0.2} stroke="var(--color-l1)" stackId={'1'} />
            {data[1] && <Area dataKey="l2" type="natural" fill="var(--color-l2)" fillOpacity={0.4} stroke="var(--color-l2)" stackId={'2'} />}
            {data[2] && <Area dataKey="l3" type="natural" fill="var(--color-l3)" fillOpacity={0.6} stroke="var(--color-l3)" stackId={'3'} />}
            {data[3] && <Area dataKey="l4" type="natural" fill="var(--color-l4)" fillOpacity={0.8} stroke="var(--color-l4)" stackId={'4'} />}
            {data[4] && <Area dataKey="l5" type="natural" fill="var(--color-l5)" fillOpacity={1} stroke="var(--color-l5)" stackId={'5'} />}

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
