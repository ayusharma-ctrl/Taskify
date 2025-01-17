"use client";
import { ArrowDownToLine, BellDotIcon, ChevronsRight, CirclePlus, RefreshCcw, UserCircle2 } from 'lucide-react'
import { Button } from "./ui/button";
import NavigateButtons from "./NavigateButtons";
import { TaskAddDialog } from "./common/TaskAddDialog";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "./common/Loader";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const SideBar = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user, logoutUser } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/auth/signout`);
            if (response?.data?.success) {
                logoutUser();
                router.push("/");
                toast.success(response?.data?.message);
            } else {
                toast.error("Something went wrong. Please try again later!");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast.error("Something went wrong. Please try again later!")
        }
    };

    return (
        <div className='h-full flex flex-col justify-start items-start gap-4 px-2'>
            <div className="flex space-x-2">
                <UserCircle2 strokeWidth={1} />
                <h1>{user?.name}</h1>
            </div>
            <div className="w-full flex justify-between items-center space-x-2">
                <div className="flex space-x-3">
                    <BellDotIcon strokeWidth={1} className="h-4 w-4" />
                    <RefreshCcw strokeWidth={1} className="h-4 w-4" />
                    <ChevronsRight strokeWidth={1} className="h-4 w-4" />
                </div>
                <Button onClick={handleLogout} className="text-xs px-2 py-3 h-0">
                    {isLoading ? <Loader text="Loading" /> : "Logout"}
                </Button>
            </div>
            <NavigateButtons />
            <div className="w-full">
                <TaskAddDialog
                    title="Create new task"
                    styles="w-full text-sm h-0 py-5 bg-blue-800"
                    icon={<CirclePlus strokeWidth={2} className="ml-2 h-5 w-5" />}
                />
            </div>
            <div className="mt-auto flex justify-center items-center space-x-2">
                <ArrowDownToLine strokeWidth={1} />
                <div className="flex flex-col">
                    <h1 className="text-sm font-normal">Download the app</h1>
                    <h2 className="text-xs font-light">Get the full experience</h2>
                </div>
            </div>
        </div>
    )
}

export default SideBar