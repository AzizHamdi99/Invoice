import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ListFactures = () => {
    const { user } = useUser()
    return (
        <div className='my-5 mx-24 '>
            <p>Mes factures</p>
            <div className='flex flex-col gap-2 md:grid grid-cols-2 lg:grid lg:grid-cols-3 '>
                <div>


                </div>


            </div>



        </div>
    )
}

export default ListFactures
