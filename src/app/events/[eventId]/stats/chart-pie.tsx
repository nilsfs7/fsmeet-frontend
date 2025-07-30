'use client';

import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface IChartPieLabelList {
  data: number[];
  labels: string[];
  colors?: string[];
  title: string;
  description?: string;
  tickLine?: boolean;
}

export function ChartPie({ data, labels, colors = [], title, description, tickLine = true }: IChartPieLabelList) {
  const chartConfig = {
    amount: {
      label: 'Amount',
    },
    ds1: {
      label: labels[0],
      color: colors[0] ? `var(${colors[0]})` : 'var(--chart-1)',
    },
    ds2: {
      label: labels[1],
      color: data[1] && data[1] !== 0 ? (colors[1] ? `var(${colors[1]})` : 'var(--chart-2)') : undefined,
    },
  } satisfies ChartConfig;

  const chartData = [
    { ds: 'ds1', amount: data[0], fill: 'var(--color-ds1)' },
    { ds: 'ds2', amount: data[1], fill: 'var(--color-ds2)' },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="ds" hideLabel />} />
            <Pie data={chartData} dataKey="amount" />
            <ChartLegend content={<ChartLegendContent nameKey="ds" />} className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
