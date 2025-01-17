import AuthProvider from "@/components/AuthProvider";
import MainDash from "@/components/MainDash";
import SideBar from "@/components/SideBar";


export default function Dashboard() {
  return (
    <AuthProvider>
      <main>
        <div className="lg:hidden p-2 text-lg">
          Taskify app is optimized for large screens only!
        </div>
        <div className="h-screen hidden lg:grid lg:grid-cols-[240px_1fr]">
          <div className="p-2">
            <SideBar />
          </div>
          <div className="col-span-1 p-2">
            <MainDash />
          </div>
        </div>
      </main>
    </AuthProvider>
  );
}