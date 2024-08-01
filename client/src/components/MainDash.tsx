"use client";
import { baseUrl, statusOptions } from '@/lib/utils';
import { setUser, userData } from '@/store/slices/userSlice';
import { CircleHelp } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import TaskStack from './common/TaskStack';
import { DndContext, rectIntersection } from "@dnd-kit/core";
import { ITask, setTasks, updateStatus } from '@/store/slices/taskSlice';
import axios from 'axios';
import { toast } from 'sonner';
import Loader from './common/Loader';

const MainDash = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/auth/user`, { withCredentials: true });
      if (response?.data?.success) {
        const user = response?.data?.user;
        dispatch(setUser(user[0]));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchUserTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/task`, { withCredentials: true });
      if (response?.data?.success) {
        const tasks: ITask[] = response?.data?.tasks || [];
        dispatch(setTasks(tasks));
        toast.success("Data refreshed!");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to fetch latest data", {
        description: "Please try again later or refresh the page!"
      });
    }
  }

  const handleTaskUpdate = async (id: string, status: string) => {
    try {
      const response = await axios.put(`${baseUrl}/task/status/${id}`, { status }, { withCredentials: true });
      if (response?.data?.success) {
        toast.success("Task status updated!");
      }
    } catch (error) {
      toast.error("Failed to save status", {
        description: "Please try again later or refresh the page!"
      });
    }
  }

  useEffect(() => {
    fetchUserData();
    fetchUserTasks();
  }, []);

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

      {isLoading && <div className='my-2'><Loader text='Fetching lastest data' /></div>}

      {/* Tasks section */}
      <DndContext
        collisionDetection={rectIntersection}
        onDragEnd={(e) => {
          const container = e.over?.id;
          const index = e.active.data.current?.index ?? 0;
          const parent = e.active.data.current?.parent ?? "to-do";
          // console.log("container:", container, "title:", index, "parent:", parent)
          if (container && typeof (container) === 'string' && container !== parent) {
            dispatch(updateStatus({ id: index, status: container })); // update local state
            handleTaskUpdate(index, container); // update db data asynchronously
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