import type { ReactElement } from "react";

export function SidebarItem({text, icon}:{
    text: string,
    icon: ReactElement
}){
    return <div className="flex max-w-48 pl-4 text-gray-700 py-2 cursor-pointer transition-all duration-300 hover:bg-gray-200 rounded-md ">
        <div className="pr-2 ">
            {icon}  
        </div>
        
        <div className="">
            {text}
        </div>
    </div>

}