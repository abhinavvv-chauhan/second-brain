import type { ReactElement } from "react";
import clsx from 'clsx';

interface ButtonProps {
    variant: "primary" | "secondary";
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
}

const variantClasses = {
    "primary": "bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300",
    "secondary": "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
};

export function Button({ variant, text, startIcon, onClick, fullWidth, loading }: ButtonProps) {
    const buttonClasses = clsx(
        "px-4 py-2 rounded-lg cursor-pointer font-semibold flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantClasses[variant],
        {
            "w-full": fullWidth,
            "opacity-50 cursor-not-allowed": loading,
        }
    );

    return (
        <button onClick={onClick} className={buttonClasses} disabled={loading}>
            {startIcon && <span className="mr-2">{startIcon}</span>}
            <span>{text}</span>
        </button>
    );
}