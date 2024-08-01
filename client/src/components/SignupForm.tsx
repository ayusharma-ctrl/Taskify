"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Loader from "./common/Loader";
import { baseUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface FormData {
    username: string;
    email: string;
    password: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
}

const SignupForm = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        validateField(name as keyof FormData, value);
    };

    const validateField = (fieldName: keyof FormData, fieldValue: string) => {
        let errorMessage = '';
        switch (fieldName) {
            case 'username':
                if (!fieldValue.trim()) {
                    errorMessage = 'Username is required.';
                }
                break;
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

    const handleValidator = () => {
        validateField("username", formData.username);
        validateField("email", formData.email);
        validateField("password", formData.password);
    }

    const handleSubmit = async () => {
        if (Object.values(formErrors).some(Boolean)|| !formData.username || !formData.email || !formData.password) {
            handleValidator();
            toast.error("Please check the credentials before submitting");
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post(`${baseUrl}/auth/signup`, formData);
            if (response?.data?.success) {
                toast.success(response?.data?.message);
                setFormData({ username: "", email: "", password: "" }); // clear form data
                setFormErrors({}); // clear errors
                router.push("/dashboard");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast.error("Signup failed", {
                description: "Please try again later or check the credentials!"
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                    Create a new account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="John Doe"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {formErrors.username && <p className="text-red-500 text-xs font-normal mt-2">{formErrors.username}</p>}
                </div>
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
                    <Label htmlFor="password">New password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Select a strong password"
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
    );
};

export default SignupForm;