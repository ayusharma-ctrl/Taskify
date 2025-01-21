import { tasksData } from '@/store/slices/taskSlice';
import React from 'react'
import { useSelector } from 'react-redux'
import TaskCard from './TaskCard';
import { useDroppable } from "@dnd-kit/core";
import { TaskAddDialog } from './TaskAddDialog';
import { Plus } from 'lucide-react';
import { IUpdating } from '../MainDash';

interface TaskStackProps {
    stackTitle: string, 
    status: string,
    isUpdating: IUpdating,
}

const TaskStack: React.FC<TaskStackProps> = ({ stackTitle, status, isUpdating }): JSX.Element => {
    const { data } = useSelector(tasksData);

    const { setNodeRef } = useDroppable({
        id: status,
    });

    return (
        <div ref={setNodeRef} className='p-2 flex flex-col items-start justify-start gap-4'>
            <h1 className='text-xl font-semibold leading-none tracking-tight'>{stackTitle}</h1>
            {data && data.length > 0 && data.filter((task) => task?.status === status).map((task, index) =>
                <TaskCard key={index} task={task} isUpdating={isUpdating} />
            )}
            <div className="w-full">
                <TaskAddDialog
                    title="Add"
                    styles="w-full text-sm h-0 py-5 bg-orange-700 flex justify-between"
                    icon={<Plus strokeWidth={2} className="ml-2 h-5 w-5" />}
                    status={status}
                />
            </div>
        </div>
    )
}

export default TaskStack