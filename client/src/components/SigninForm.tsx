"use client";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { baseUrl } from "@/lib/utils";
import axios from "axios";
import Loader from "./common/Loader";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

export function SigninForm() {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const router = useRouter();

    const dispatch = useDispatch();

    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        validateField(name as keyof FormData, value);
    };

    const validateField = (fieldName: keyof FormData, fieldValue: string) => {
        let errorMessage = '';
        switch (fieldName) {
            case 'email':
                if (!/\S+@\S+\.\S+/.test(fieldValue)) {
                    errorMessage = 'Please enter a valid email address.';
                }
                break;
            case 'password':
                if (fieldValue.length < 8) {
                    errorMessage = 'Password must be at least 8 characters long.';
                }
                break;
            default:
                break;
        }
        setFormErrors(prevErrors => ({ ...prevErrors, [fieldName]: errorMessage }));
    };

    const handleSubmit = async () => {
        // validation
        if (Object.values(formErrors).some(Boolean) || !formData.email?.length || !formData.password?.length) {
            validateField("email", formData.email);
            validateField("password", formData.password);
            toast.error("Please check the credentials before submitting");
            return;
        }
        
        try {
            setIsLoading(true);
            const response = await axios.post(`${baseUrl}/auth/signin`, formData, { withCredentials: true });
            if (response?.data?.success) {
                dispatch(setUser({ email: response?.data?.user?.email, name: response?.data?.user?.name }))
                toast.success(response?.data?.message);
                setFormData({ email: "", password: "" }); // clear form data
                setFormErrors({}); // clear errors
                router.push("/dashboard");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast.error("Login failed", {
                description: "Please try again later or check the credentials!"
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@doe.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs font-normal mt-2">{formErrors.email}</p>}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {formErrors.password && <p className="text-red-500 text-xs font-normal mt-2">{formErrors.password}</p>}
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    disabled={Object.values(formErrors).some(Boolean) || isLoading}
                    onClick={handleSubmit}
                >
                    {isLoading ? <Loader text="Loading" /> : "Submit"}
                </Button>
            </CardFooter>
        </Card>
    )
}