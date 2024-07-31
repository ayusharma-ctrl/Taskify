import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChartLine, House, Settings, SquareKanban, UsersRound } from 'lucide-react';

const buttons = [
    { text: 'Home', route: '/dashboard', icon: <House strokeWidth={1} className='h-5 w-5 mr-2' /> },
    { text: 'Board', route: '/board', icon: <SquareKanban strokeWidth={1} className='h-5 w-5 mr-2' /> },
    { text: 'Settings', route: '/settings', icon: <Settings strokeWidth={1} className='h-5 w-5 mr-2' /> },
    { text: 'Teams', route: '/teams', icon: <UsersRound strokeWidth={1} className='h-5 w-5 mr-2' /> },
    { text: 'Analytics', route: '/analytics', icon: <ChartLine strokeWidth={1} className='h-5 w-5 mr-2' /> },
];

const NavigateButtons: React.FC = () => {
    const [activeRoute, setActiveRoute] = useState<string>('/');
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = (route: string) => {
        setActiveRoute(route);
        router.push(route);
    };

    useEffect(() => {
        setActiveRoute(pathname); 
    }, [pathname]);

    return (
        <div className="w-full flex flex-col gap-3">
            {buttons.map(({ text, route, icon }) => (
                <button
                    key={route}
                    className={`flex text-sm p-1 rounded-sm ${activeRoute === route ? "bg-gray-200" : "bg-none hover:bg-gray-100"}`}
                    onClick={() => handleClick(route)}
                >
                    {icon}
                    {text}
                </button>
            ))}
        </div>
    );
};

export default NavigateButtons;