import { deleteTask, ITask, updateTask } from '@/store/slices/taskSlice'
import { Calendar, Clock, Loader, Maximize2, Minimize2, OctagonAlert, Pencil, Trash2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { format, formatRelative } from 'date-fns';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { baseUrl, priorityOptions, statusOptions } from '@/lib/utils';
import { Input } from '../ui/input';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';

interface FormData {
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline: string;
}

interface FormErrors {
    title?: string;
    status?: string;
}

const TaskCard = ({ task }: { task: ITask }): JSX.Element => {
    const [formData, setFormData] = useState<FormData>({
        title: task.title || '',
        description: task.description || '',
        status: task.status || '',
        priority: task.priority || '',
        deadline: task.deadline || '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();

    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const validateField = (fieldName: keyof FormData, fieldValue: string) => {
        let errorMessage = '';
        switch (fieldName) {
            case 'title':
                if (!fieldValue.trim()) {
                    errorMessage = 'Title is required.';
                }
                break;
            case 'status':
                if (!fieldValue.trim()) {
                    errorMessage = 'Status is required.';
                }
                break;
            default:
                break;
        }
        setFormErrors(prevErrors => ({ ...prevErrors, [fieldName]: errorMessage }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        validateField(name as keyof FormData, value);
    };

    // delete task
    const handleDelete= async () => {
        try {
            const response = await axios.delete(`${baseUrl}/task/${task._id}`, { withCredentials: true });
            if (response?.status === 204) {
                dispatch(deleteTask(task._id)); // delete from redux state
                toast.success("Successfully deleted a task");
                setFormData({ title: "", deadline: "", description: "", status: "", priority: "" }); // clear form data
                setFormErrors({}); // clear errors
                setIsDialogOpen(false); // close dialog
            }
        } catch (error) {
            toast.error("Failed to delete", {
                description: "Please try again later!"
            });
        }
    };

    // updating task data
    const handleSubmit = async () => {
        if (Object.values(formErrors).some(Boolean) || !formData.title || !formData.status) {
            validateField("title", formData.title);
            validateField("status", formData.status);
            toast.error("Please check the credentials before submitting");
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.put(`${baseUrl}/task/${task._id}`, formData, { withCredentials: true });
            if (response?.data?.success) {
                dispatch(updateTask(response?.data?.task)); // update redux state
                toast.success(response?.data?.message);
                // setFormData({ title: "", deadline: "", description: "", status: "", priority: "" }); // clear form data
                setFormErrors({}); // clear errors
                setIsDialogOpen(false); // close dialog
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast.error("Failed to update", {
                description: "Please try again later or check the required fields!"
            });
        }
    };

    // dragging implementation
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


    const [dialogStyles, setDialogStyles] = useState<string>(''); // state to control dialog expansion

    const [isDragging, setIsDragging] = useState(false); // state to enable onclick on draggable card
    const clickTimeout = useRef<NodeJS.Timeout | null>(null); // this is to check card is in dragging motion

    // below methods to enable onclick on card, beacause of listners, pointer events are disabled on parent div
    const handleMouseDown = () => {
        setIsDragging(false);
        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current);
        }
    };

    const handleMouseUp = () => {
        clickTimeout.current = setTimeout(() => {
            if (!isDragging) {
                setIsDialogOpen(true);
            }
        }, 300);
    };

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <div
                        className='border rounded-md bg-gray-200 shadow-inner w-full px-2 py-3 flex flex-col gap-3'
                        style={style}
                        {...listeners}
                        {...attributes}
                        ref={setNodeRef}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    >
                        <h1 className='text-xs lg:text-base font-medium'>{task?.title}</h1>
                        <h1 className='text-xxs lg:text-sm font-normal'>{task?.description}</h1>
                        {task?.priority &&
                            <div
                                className={`py-1 px-3 text-xs text-white max-w-max rounded-md 
                ${task.priority === 'low' ? 'bg-green-400' : task.priority === 'medium' ? 'bg-yellow-400' : 'bg-red-400'}`}
                            >
                                {task?.priority?.charAt(0)?.toUpperCase()}
                                {task?.priority?.slice(1)}
                            </div>
                        }
                        {task?.deadline &&
                            <div className='flex items-center text-xs space-x-2'>
                                <Clock strokeWidth={1.25} className='w-5 h-5' />
                                <span>{format(task?.deadline, 'MMM d, yyyy')}</span>
                            </div>
                        }
                        <div className='text-gray-400 text-xs'>
                            {task?.createdAt && formatRelative(task?.createdAt, new Date())}
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className={`${dialogStyles.length ? dialogStyles : "md:min-w-[725px]"}`}>
                    <DialogHeader>
                        <div className='absolute right-4 top-4 flex items-center gap-3 cursor-pointer'>
                            {
                                dialogStyles.length ? <Minimize2 size={20} onClick={() => setDialogStyles("")} strokeWidth={1.5} className='h-5 w-5' />
                                    : <Maximize2 onClick={() => setDialogStyles("h-full min-w-full")} size={20} strokeWidth={1.5} className='h-5 w-5' />
                            }
                            <Button onClick={handleDelete} variant={'outline'} size={'sm'}>
                                <Trash2 size={20} strokeWidth={1} className='h-4 w-4 mr-2' />
                                Delete
                            </Button>
                        </div>
                    </DialogHeader>
                    <div className="flex flex-col justify-start items-start gap-4 py-4">
                        <div className="w-full space-y-1">
                            <Input
                                required
                                name="title"
                                type="text"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleChange}
                                className="width-full text-lg lg:text-3xl focus:outline-none border-none py-2"
                            />
                            {formErrors.title && <p className="text-red-500 text-xs font-normal mt-2">{formErrors.title}</p>}
                        </div>

                        <div className="grid grid-cols-[auto,2fr,2fr] gap-4">
                            <div className="flex items-center">
                                <Loader strokeWidth={1} className="w-5 h-5" />
                            </div>

                            <div className="flex items-center">
                                <Label htmlFor="status" className="text-sm lg:text-base">Status</Label>
                            </div>

                            <div className="flex items-center">
                                <select
                                    required
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="p-2 appearance-none w-full text-base"
                                >
                                    <option value="" disabled>Select Status</option>
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formErrors.status && (
                                <p className="text-red-500 text-xs font-normal mt-2 col-span-3">
                                    {formErrors.status}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-[auto,2fr,2fr] gap-4">
                            <div className="flex items-center">
                                <OctagonAlert strokeWidth={1} className="w-5 h-5" />
                            </div>

                            <div className="flex items-center">
                                <Label htmlFor="priority" className="text-sm lg:text-base">Priority</Label>
                            </div>

                            <div className="flex items-center">
                                <select
                                    required
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="p-2 appearance-none w-full text-base"
                                >
                                    <option value="" disabled>Select Priority</option>
                                    {priorityOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-[auto,1.5fr,2fr] gap-4">

                            <div className="flex items-center">
                                <Calendar strokeWidth={1} className="w-5 h-5" />
                            </div>

                            <div className="flex items-center">
                                <Label htmlFor="deadline" className="text-sm lg:text-base">Deadline</Label>
                            </div>


                            <div className="flex items-center">
                                <input
                                    required
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="px-2 w-full text-base"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-[auto,0.4fr,2fr] gap-4 mt-4 w-full">

                            <div className="py-2">
                                <Pencil strokeWidth={1} className="w-5 h-5" />
                            </div>

                            <div className="py-2">
                                <Label htmlFor="description" className="text-sm lg:text-base">Description</Label>
                            </div>

                            <div>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter description here"
                                    className="w-full px-5 py-2 text-base resize-none"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSubmit} disabled={isLoading} className="w-full">
                            {isLoading ? <Loader className="animate-spin h-5 w-5" /> : "Save changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default TaskCard