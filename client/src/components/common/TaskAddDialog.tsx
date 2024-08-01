import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { baseUrl, priorityOptions, statusOptions } from "@/lib/utils";
import { addTask } from "@/store/slices/taskSlice";
import axios from "axios";
import { Calendar, Loader, OctagonAlert, Pencil } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface IProps {
    title: string,
    styles: string,
    icon: JSX.Element,
    status?: string,
}

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

export function TaskAddDialog(props: IProps): JSX.Element {
    const { title, styles, icon, status } = props;
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        status: status || '',
        priority: '',
        deadline: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();

    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        validateField(name as keyof FormData, value);
    };

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

    const handleSubmit = async () => {
        if (Object.values(formErrors).some(Boolean) || !formData.title || !formData.status) {
            validateField("title", formData.title);
            validateField("status", formData.status);
            toast.error("Please check the credentials before submitting");
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post(`${baseUrl}/task`, formData, { withCredentials: true });
            if (response?.data?.success) {
                dispatch(addTask(response?.data?.task));
                toast.success(response?.data?.message);
                setFormData({ title: "", deadline: "", description: "", status: "", priority: "" }); // clear form data
                setFormErrors({}); // clear errors
                setIsDialogOpen(false);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast.error("Failed to add", {
                description: "Please try again later or check the required fields!"
            });
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className={styles}>
                    {title}
                    {icon}
                </Button>
            </DialogTrigger>
            <DialogContent className="md:min-w-[725px]">
                <DialogHeader>
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
    )
}