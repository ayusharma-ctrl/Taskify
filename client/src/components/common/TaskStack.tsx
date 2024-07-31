import { tasksData } from '@/store/slices/taskSlice';
import React from 'react'
import { useSelector } from 'react-redux'
import TaskCard from './TaskCard';
import { useDroppable } from "@dnd-kit/core";

const TaskStack = ({ stackTitle, status }: { stackTitle: string, status: string }): JSX.Element => {
    const { data } = useSelector(tasksData);

    const { setNodeRef } = useDroppable({
        id: status,
    });

    return (
        <div ref={setNodeRef} className='p-2 flex flex-col items-start justify-start gap-4'>
            <h1>{stackTitle}</h1>
            {data && data.length > 0 && data.filter((task) => task.status === status).map((task, index) =>
                <TaskCard key={index} task={task} />
            )}
        </div>
    )
}

export default TaskStack