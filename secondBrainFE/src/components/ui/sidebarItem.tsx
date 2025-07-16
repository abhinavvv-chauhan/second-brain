import type { ReactElement } from "react";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
  isActive: boolean;
  onClick: () => void;
}

export function SidebarItem({ text, icon, isActive, onClick }: SidebarItemProps) {
  const activeClasses = "bg-slate-200 text-slate-900 font-semibold dark:bg-slate-700 dark:text-slate-100";
  const inactiveClasses = "text-gray-600 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-slate-800";

  return (
    <div onClick={onClick}
        className={`flex items-center w-full pl-4 py-2 my-1 cursor-pointer transition-colors duration-200 rounded-lg 
        ${isActive ? activeClasses : inactiveClasses}`}>
      <div className="mr-3">{icon}</div>
      <span>{text}</span>
    </div>
  );
}