import { Logo } from "../../icons/Logo";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SidebarItem } from "./sidebarItem";

export function Sidebar(){
    return <div className="h-screen shadow-md bg-white border-r w-70 fixed left-0 top-0 pl-6">
        <div className="flex text-2xl pt-8 items-center cursor-pointer">
            <div className="pr-2"> 
                <Logo/>
            </div>
            
            Second Brain
        </div>
        <div className="pt-8 pl-4" >
            <SidebarItem text="Twitter" icon={<TwitterIcon/>}/>
            <SidebarItem text="Youtube" icon={<YoutubeIcon/>}/>
        </div>
    </div>
}