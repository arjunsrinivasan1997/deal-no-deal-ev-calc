"use client"

import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/button"

export function ThemeToggle() {
    const {setTheme, theme} = useTheme()

    return (
        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]"/> : <Sun className="h-[1.2rem] w-[1.2rem]"/>}
            <span className="sr-only">Toggle theme</span>
        </Button>)
}

