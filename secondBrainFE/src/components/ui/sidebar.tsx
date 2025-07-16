import { Logo } from "../../icons/Logo";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { AllIcon } from "../../icons/AllIcon";
import { LogoutIcon } from "../../icons/LogoutIcon";
import { SidebarItem } from "./sidebarItem";
import { Button } from "./button";

export type FilterType = 'all' | 'twitter' | 'youtube';

interface SidebarProps {
    activeFilter: FilterType;
    setActiveFilter: (filter: FilterType) => void;
    onLogout: () => void;
}

export function Sidebar({ activeFilter, setActiveFilter, onLogout }: SidebarProps) {
    return (
        <div className="h-screen shadow-md bg-white border-r w-72 fixed left-0 top-0 p-6 flex flex-col dark:bg-slate-900 dark:border-r-slate-800">
            <div className="flex text-2xl items-center cursor-pointer mb-12 flex-shrink-0 text-slate-800 dark:text-slate-200">
                <div className="pr-2"><Logo/></div>
                Second Brain
            </div>
            
            <div className="flex flex-col gap-2 flex-grow">
                 <h3 className="px-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">Categories</h3>
                <SidebarItem text="All" icon={<AllIcon />} isActive={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                <SidebarItem text="Twitter" icon={<TwitterIcon />} isActive={activeFilter === 'twitter'} onClick={() => setActiveFilter('twitter')} />
                <SidebarItem text="Youtube" icon={<YoutubeIcon />} isActive={activeFilter === 'youtube'} onClick={() => setActiveFilter('youtube')} />
            </div>
            
            <div className="flex flex-col gap-2 flex-shrink-0">
                <Button 
                    variant="secondary" 
                    text="Logout" 
                    onClick={onLogout} 
                    fullWidth={true} 
                    startIcon={<LogoutIcon />} 
                />
            </div>
        </div>
    );
}