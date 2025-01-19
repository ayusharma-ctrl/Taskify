"use client"

import * as React from "react";
import { useSelector } from "react-redux";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { tasksData } from "@/store/slices/taskSlice";

const chartConfig = {
    tasks: {
        label: "Tasks",
    },
    "to-do": {
        label: "To Do",
        color: "hsl(var(--chart-1))",
    },
    "in-progress": {
        label: "In Progress",
        color: "hsl(var(--chart-2))",
    },
    "under-review": {
        label: "Under Review",
        color: "hsl(var(--chart-3))",
    },
    "finished": {
        label: "Finished",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig

export function TaskStatusChart() {
    const id = "task-status-pie";
    const { data } = useSelector(tasksData);

    const taskStatusData = React.useMemo(() => {
        const statusCounts = data && data?.length > 0 && data?.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1
            return acc
        }, {} as Record<string, number>);

        return Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
            fill: `var(--color-${status})`,
        }))
    }, [data]);

    const [activeStatus, setActiveStatus] = React.useState(taskStatusData[0]?.status || "");

    const activeIndex = React.useMemo(
        () => taskStatusData.findIndex((item) => item.status === activeStatus),
        [activeStatus, taskStatusData]
    )

    const statuses = React.useMemo(() => taskStatusData.map((item) => item.status), [taskStatusData]);

    if (!data || data.length == 0) {
        return (
            <div>
                <h1 className='text-xl font-semibold leading-none tracking-tight top-0 sticky bg-white pb-2'>Insights</h1>
                <span className="text-gray-600">No data exists!</span>
            </div>
        )
    }

    return (
        <Card data-chart={id} className="flex flex-col">
            <ChartStyle id={id} config={chartConfig} />
            <CardHeader className="flex-row items-start space-y-0 pb-0 sticky top-2 bg-white">
                <div className="grid gap-1">
                    <CardTitle>Task Status</CardTitle>
                    <CardDescription>Distribution of tasks by status</CardDescription>
                </div>
                <Select value={activeStatus} onValueChange={setActiveStatus}>
                    <SelectTrigger
                        className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                        aria-label="Select a status"
                    >
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                        {statuses.map((status) => {
                            const config = chartConfig[status as keyof typeof chartConfig]

                            if (!config) {
                                return null
                            }

                            return (
                                <SelectItem
                                    key={status}
                                    value={status}
                                    className="rounded-lg [&_span]:flex"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <span
                                            className="flex h-3 w-3 shrink-0 rounded-sm"
                                            style={{
                                                backgroundColor: `var(--color-${status})`,
                                            }}
                                        />
                                        {config?.label}
                                    </div>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center pb-0">
                <ChartContainer
                    id={id}
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={taskStatusData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={activeIndex}
                            activeShape={({
                                outerRadius = 0,
                                ...props
                            }: PieSectorDataItem) => (
                                <g>
                                    <Sector {...props} outerRadius={outerRadius + 10} />
                                    <Sector
                                        {...props}
                                        outerRadius={outerRadius + 25}
                                        innerRadius={outerRadius + 12}
                                    />
                                </g>
                            )}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {taskStatusData[activeIndex]?.count.toLocaleString() || 0}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Tasks
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}