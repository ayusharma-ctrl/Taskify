import { notificationsData } from '@/store/slices/notificationSlice';
import React from 'react'
import { useSelector } from 'react-redux';
import { TaskStatusChart } from './common/TaskStatusChart';

const AnalyticsDash = () => {
    const notifications = useSelector(notificationsData);

    return (
        <div className='w-full max-h-[380px] grid grid-cols-2 gap-4 mb-4'>

            {/* charts */}
            <div className='overflow-auto'>
                <TaskStatusChart />
            </div>

            {/* notifications */}
            <div className='overflow-auto px-2 rounded-lg'>
                <h1 className='text-xl font-semibold leading-none tracking-tight top-0 sticky bg-white pb-2'>AI Agent Notifications</h1>
                <div className='flex-col justify-start items-start space-y-4 my-4'>
                    {!notifications || notifications?.length === 0 ?
                        <span className='relative -top-4 text-gray-600'>No notifications.</span> : (
                            notifications.map(notification => (
                                <div key={notification._id} className='rounded-lg border-t border-black shadow-md p-2'>
                                    <span className={`${notification?.type === 'summary' && 'text-yellow-400'} capitalize text-base font-medium text-red-500`}>{notification?.type}</span>
                                    <br />
                                    <p className='text-sm font-light'>{notification?.description}</p>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default AnalyticsDash