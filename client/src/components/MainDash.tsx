"use client";
import { statusOptions } from '@/lib/utils';
import { userData } from '@/store/slices/userSlice';
import { CircleHelp } from 'lucide-react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import TaskStack from './common/TaskStack';
import { DndContext, rectIntersection } from "@dnd-kit/core";
import { updateStatus } from '@/store/slices/taskSlice';

const MainDash = () => {
  const { name } = useSelector(userData);
  const dispatch = useDispatch();

  const getGreeting = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 0 && hours < 12) {
      return "Good Morning";
    } else if (hours >= 12 && hours < 16) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  return (
    <div className='h-full flex flex-col justify-start items-start gap-4 px-2'>

      {/* Greeting Section */}
      <div className='w-full flex justify-between items-center'>
        <div className='text-lg lg:text-2xl font-semibold'>
          {`${getGreeting()}, ${name?.split(' ')[0]}!`}
        </div>
        <div className='text-xs lg:text-sm flex items-center gap-2'>
          Help & Feedback
          <CircleHelp className='h-4 w-4' />
        </div>
      </div>

      {/* Tasks section */}
      <DndContext
        collisionDetection={rectIntersection}
        onDragEnd={(e) => {
          const container = e.over?.id;
          const index = e.active.data.current?.index ?? 0;
          const parent = e.active.data.current?.parent ?? "to-do";
          // console.log("container:", container, "title:", index, "parent:", parent)
          if (container && typeof (container) === 'string' && container !== parent) {
            dispatch(updateStatus({ id: index, status: container }));
          }
        }}
      >
        <div className='w-full grid grid-cols-[1fr,1fr,1fr,1fr] gap-4'>
          {statusOptions.map((status, index) =>
            <TaskStack key={index} stackTitle={status.label} status={status.value} />
          )}
        </div>
      </DndContext>

    </div>
  )
}

export default MainDash