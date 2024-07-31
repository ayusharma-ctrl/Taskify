import { ITask } from '@/store/slices/taskSlice'
import { Clock } from 'lucide-react'
import React from 'react'
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ task }: { task: ITask }): JSX.Element => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task._id,
        data: {
            title: task.title,
            index: task._id,
            parent: task.status,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div
            className='border rounded-md bg-gray-200 shadow-inner w-full px-2 py-3 flex flex-col gap-3'
            style={style}
            {...listeners}
            {...attributes}
            ref={setNodeRef}
        >
            <h1 className='text-xs lg:text-base font-medium'>{task?.title}</h1>
            <h1 className='text-xxs lg:text-sm font-normal'>{task?.description}</h1>
            <div
                className={`py-1 px-3 text-xs text-white max-w-max rounded-md 
                ${task.priority === 'low' ? 'bg-green-400' : task.priority === 'medium' ? 'bg-yellow-400' : 'bg-red-400'}`}
            >
                {task?.priority?.charAt(0)?.toUpperCase()}
                {task?.priority?.slice(1)}
            </div>
            <div className='flex items-center text-sm space-x-2'>
                <Clock strokeWidth={1.25} className='w-5 h-5' />
                <span>{task?.deadline}</span>
            </div>
            <div className='text-gray-400 text-xs'>
                {task?.createdAt?.toDateString()}
            </div>
        </div>
    )
}

export default TaskCard