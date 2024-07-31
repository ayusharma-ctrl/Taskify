import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SigninForm } from "@/components/SigninForm";
import SignupForm from "@/components/SignupForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-8 p-12 bg-gray-200">
      <h1 className="text-3xl font-bold">Taskify</h1>
      <Tabs defaultValue="signin" className="w-[300px] md:w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SigninForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </main>
  );
}
