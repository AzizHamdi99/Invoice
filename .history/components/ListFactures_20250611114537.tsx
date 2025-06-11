"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
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
import { Layers } from 'lucide-react'
import { title } from 'process'
import { createInvoice, getUserInvoices } from '@/actions/actions'
import axios from 'axios'

const ListFactures = () => {
    const { user } = useUser()
    const [title, setTitle] = useState("")

    const [invoices, setInvoices] = useState<any[]>([])
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    const fetchInvoices = async () => {
        if (!userEmail) return
        try {
            const res = await axios.get("/api/invoices", { params: { email: userEmail } })
            console.log(res.data.data)
            setInvoices(res.data.data || [])

        } catch (error) {
            console.error("Error fetching invoices:", error);

        }



    }



    const addInvoice = async () => {
        if (!userEmail || !title) return

        try {
            const res = await axios.post("/api/invoices", { email: userEmail, title })
            if (res.status === 201) {
                await fetchInvoices()
                setTitle("")

            }
        } catch (error) {
            console.error("Failed to create invoice:", error);
        }
    }


    useEffect(() => {

        fetchInvoices()
    }, [userEmail])

    return (
        <div className='my-5 mx-24 '>
            <p>Mes factures</p>
            <div className='flex flex-col gap-2 md:grid grid-cols-2 lg:grid lg:grid-cols-3 mt-3 '>
                <div >
                    <Dialog>
                        <DialogTrigger asChild className='cursor-pointer'>
                            <Button className='h-36 w-90 border-2 border-[#ff8600]  flex flex-col items-center justify-center ' variant="outline">
                                <p className='text-[#ff8600] text-xl'>Create Invoice</p>
                                <Layers size={90} className=' bg-black text-[#f3aa47] rounded-full p-1' />

                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className='font-semibold'>New Invoice</DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center gap-2">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="link" className="sr-only">
                                        Link
                                    </Label>
                                    <Input onChange={(e) => setTitle(e.target.value)}

                                    />
                                </div>
                            </div>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <Button type="button" disabled={title.length === 0} className='bg-[#ff8600] cursor-pointer' onClick={() => addInvoice()}>
                                        Create
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>


                </div>
                <div>
                    {invoices.map((inv, i) => (
                        <h1>{inv.title}</h1>
                    ))}
                </div>


            </div>



        </div>
    )
}

export default ListFactures
