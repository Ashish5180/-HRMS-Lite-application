import { LucideIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    isLoading?: boolean;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    isLoading,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
        secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        outline: 'border border-zinc-200 bg-transparent hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900',
        ghost: 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : Icon ? (
                <Icon className={cn("h-4 w-4", children ? "mr-2" : "")} />
            ) : null}
            {children}
        </button>
    );
}
