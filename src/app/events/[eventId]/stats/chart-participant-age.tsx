'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
interface IChartPieLabelList {
  data: number[];
  labels: string[];
  colors?: string[];
  title: string;
  description?: string;
  tickLine?: boolean;
}

export function ChartParticipantAge({ data, labels, colors = [], title, description, tickLine = true }: IChartPieLabelList) {
  const chartConfig = {
    ds1: {
      label: labels[0],
      color: colors[0] ? `var(${colors[0]})` : 'var(--chart-1)',
    },
    ds2: {
      label: labels[1],
      color: data[1] && data[1] !== 0 ? (colors[1] ? `var(${colors[1]})` : 'var(--chart-2)') : undefined,
    },
    ds3: {
      label: labels[2],
      color: data[2] && data[2] !== 0 ? (colors[2] ? `var(${colors[2]})` : 'var(--chart-3)') : undefined,
    },
    ds4: {
      label: labels[3],
      color: data[3] && data[3] !== 0 ? (colors[3] ? `var(${colors[3]})` : 'var(--chart-4)') : undefined,
    },
    ds5: {
      label: labels[4],
      color: data[4] && data[4] !== 0 ? (colors[4] ? `var(${colors[4]})` : 'var(--chart-5)') : undefined,
    },
  } satisfies ChartConfig;

  const chartData = [{ ds: 'Age', ds1: data[0], ds2: data[1], ds3: data[2], ds4: data[3], ds5: data[4] }];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="ds" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis dataKey={`ds${(data.indexOf(Math.max(...data)) + 1).toString()}`} tickLine={tickLine} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar dataKey="ds1" fill="var(--color-ds1)" radius={4} />
            <Bar dataKey="ds2" fill="var(--color-ds2)" radius={4} />
            <Bar dataKey="ds3" fill="var(--color-ds3)" radius={4} />
            <Bar dataKey="ds4" fill="var(--color-ds4)" radius={4} />
            <Bar dataKey="ds5" fill="var(--color-ds5)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
