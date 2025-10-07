"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"


const SectionGeneral = () => {
    const [theme, setTheme] = useState("روشن")

    return (
        <div
            className="flex flex-col"
        >
            <h2 className="text-lg font-medium text-nowrap">تنظیمات عمومی</h2>
            <hr className="my-2"/>
            <div
                className="flex items-center justify-between p-4"
            >
                <div>
                    <h4 className="text-black text-sm">تم برنامه</h4>
                    <p className="text-gray-500 text-sm">تم مورد نظر خود را انتخاب کنید</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                        >
                            <ChevronDown /> {theme}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="sr-only">تم پس زمینه</DropdownMenuLabel>
                        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                            <DropdownMenuRadioItem value="روشن">روشن</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="تاریک">تاریک</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>                            
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default SectionGeneral