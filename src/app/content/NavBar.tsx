"use client"
import AddContentDialog from "@/components/ui/AddContentDialog";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
    const [showAddContentDialog,setShowAddContentDialog] = useState(false)
    return ( 
    <>
    <div className="p-4 shadow ">
        <div className="flex flex-wrap gap-3 items-center justify-between max-w-7xl">
            <Link href="/content" className="flex items-center gap-1">
                <h6 className="font-bold">Dashboard</h6>
            </Link>
            <div className="flex items-center gap-2">
                <UserButton afterSignOutUrl="/" appearance={
                    {
                        elements: {avatarBox: {width: "2.5rem",height: "2.5rem"}}
                    }
                }/>
                <Button onClick={() => setShowAddContentDialog(true)}className="ml-4"> <Plus size={20} className="mr-2" />Attach Document</Button>
            </div>
        </div>
    </div> 
    <AddContentDialog open={showAddContentDialog} setOpen={setShowAddContentDialog} />
    </>
    )
}