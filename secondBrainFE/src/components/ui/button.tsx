import type { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary";
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
}

const variantClasses = {
    "primary": "bg-purple-600 cursor-pointer text-white",
    "secondary": "bg-purple-200 cursor-pointer text-purple-600",
};

const defaultStyles = "px-4 py-2 rounded-md font-light flex items-center";


export function Button({variant, text, startIcon, onClick, fullWidth, loading}: ButtonProps) {
    return <button onClick={onClick} className={variantClasses[variant] + " " + defaultStyles + `${fullWidth ? " w-full flex justify-center items-center" : ""} ${loading ? "opacity-45	" : ""}`} disabled={loading}>
        <div className="pr-2">
            {startIcon}
        </div>
        {text}
    </button>
}



// ------------------------------------------

// import type { ReactElement } from "react"


// type Variants = "primary" | "secondary"
//  interface ButtonProps{
//     variant: Variants,
//     size?: "sm" | "md" | "lg",
//     startIcon?: ReactElement,
//     endIcon?: ReactElement,
//     onClick?: () => void,
//     text: string,
//     loading?: boolean
// }

// const variantStyles = {
//     "primary": "bg-purple-600 text-white",
//     "secondary": "bg-purple-200 text-purple-600"
// }

// const sizeStyles = {
//     "sm":"py-1 px-2 text-sm",
//     "md":"py-2 px-4 text-md",
//     "lg":"py-4 px-6 text-xl"
// }

// const defaultStyles = "rounded-md flex items-center font-bold" 

// // export const Button = (props: ButtonProps) => {
// //     return <button className={`${variantStyles[props.variant]} ${defaultStyles} ${onclick} ${sizeStyles[props.size ]}`}>
// //         {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null} {props.text} {props.endIcon}
// //         </button>
// // }
 
// export function Button({variant,size,loading,text,startIcon,onClick}: ButtonProps){
//     return <button 
//         onClick={onClick} 
//         className={`cursor-pointer ${loading ? "!bg-gray-600 cursor-default" : variantStyles[variant]} ${defaultStyles} ${sizeStyles[size || "md"]}`} 
//         disabled={loading}
//     >
//         {startIcon && <div className="pr-2">{startIcon}</div>}
//         {text}
//     </button>
// }