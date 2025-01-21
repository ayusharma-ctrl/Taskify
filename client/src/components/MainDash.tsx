"use client";
import { baseUrl, statusOptions } from '@/lib/utils';
import { setUser, userData } from '@/store/slices/userSlice';
import { CircleHelp } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import TaskStack from './common/TaskStack';
import { DndContext, rectIntersection } from "@dnd-kit/core";
import { addTask, ITask, setTasks, updateStatus } from '@/store/slices/taskSlice';
import axios from 'axios';
import { toast } from 'sonner';
import Loader from './common/Loader';
import api from '@/lib/api';
import { setNotifications } from '@/store/slices/notificationSlice';
import AnalyticsDash from './AnalyticsDash';
import socket from '@/lib/socket';

export interface IUpdating {
  activeCardId: string | null
}

const MainDash = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { name } = useSelector(userData);
  const dispatch = useDispatch();

  const [isUpdating, setIsUpdating] = useState<IUpdating>({ activeCardId: null });

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
      const response = await api.get("/auth/user");
      if (response?.data?.success) {
        const user = response?.data?.user;
        const userData = {
          name: user?.name,
          email: user?.name,
        }
        const notifications = response?.data?.notifications;
        dispatch(setNotifications(notifications));
        dispatch(setUser(userData));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchUserTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/task");
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
      setIsUpdating({ activeCardId: id });
      const response = await api.put(`/task/status/${id}`, { status });
      if (response?.data?.success) {
        toast.success("Task status updated!");
      }
    } catch (error) {
      toast.error("Failed to save status", {
        description: "Please try again later or refresh the page!"
      });
    } finally {
      setIsUpdating({ activeCardId: null });
    }
  }

  useEffect(() => {
    fetchUserData();
    fetchUserTasks();
  }, []);

  useEffect(() => {
    socket.connect();

    // listen new task event
    socket.on("newTask", (task: ITask) => {
      dispatch(addTask(task));
      toast.success("New task added successfully!");
    });

    // clean listeners on unmount
    return () => {
      socket.disconnect();
    }
  }, [socket]);

  return (
    <div className='h-full flex flex-col justify-start items-start gap-4 px-2'>

      {/* Greeting Section */}
      <div className='w-full flex justify-between items-center'>
        <div className='text-lg lg:text-2xl font-semibold'>
          {`${getGreeting()}, ${name?.split(' ')[0]}!`}
        </div>

        <div className='flex justify-between items-center space-x-2'>
          {isLoading && <Loader text='Fetching lastest data' />}

          <div className='text-xs lg:text-sm flex items-center gap-2'>
            Help & Feedback
            <CircleHelp className='h-4 w-4' />
          </div>

        </div>
      </div>

      {/* Dahsboard */}
      <AnalyticsDash />

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
        <div className='w-full h-full grid grid-cols-[1fr,1fr,1fr,1fr] gap-4'>
          {statusOptions.map((status, index) =>
            <TaskStack key={index} stackTitle={status.label} status={status.value} isUpdating={isUpdating} />
          )}
        </div>
      </DndContext>

    </div>
  )
}

export default MainDash