import MainDash from "@/components/MainDash";
import SideBar from "@/components/SideBar";


export default function Dashboard() {
  return (
    <main className="h-screen grid lg:grid-cols-[240px_1fr]">
      <div className="hidden lg:block p-2">
        <SideBar />
      </div>
      <div className="col-span-1 p-2">
        <MainDash />
      </div>
    </main>
  );
}