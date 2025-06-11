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
import { CircleCheck, CircleCheckBig, CircleX, Clock4, ExternalLink, FileSpreadsheet, Layers } from 'lucide-react'
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


    const getStatus = (status: number) => {
        switch (status) {
            case 0:
                return <div className='flex items-center gap-1 p-1 px-4 rounded-xl bg-white w-fit'>
                    <FileSpreadsheet size={20} />
                    <p >Draft</p>


                </div>
            case 1:
                return <div>
                    <Clock4 />
                    <p>Pending</p>


                </div>
            case 2:
                return <div>
                    <CircleCheck />
                    <p>Paid</p>


                </div>
            case 3:
                return <div>
                    <CircleX />
                    <p>Unpaid</p>


                </div>
            case 4:
                return <div>
                    <CircleX />
                    <p>Cancelled</p>


                </div>
            default:
                return (
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                        <p>Unknown</p>
                    </div>
                )
        }

    }

    return (
        <div className='my-5 mx-24 '>
            <p>Mes factures</p>
            <div className='flex flex-col md:grid grid-cols-2 lg:grid lg:grid-cols-3 mt-3 gap-6 '>

                <Dialog>
                    <DialogTrigger asChild className='cursor-pointer'>
                        <Button className='h-40 border-2 border-[#ff8600]  flex flex-col items-center justify-center ' variant="outline">
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

                {invoices.map((inv, i) => (
                    <div className=' bg-[#eaeaea] p-5 flex justify-between rounded-md'>
                        <div>
                            <div>
                                {getStatus(inv.status)}
                            </div>
                            <p>INVOICE-{inv.id}</p>
                            <p>{inv.total.toFixed(2)}</p>
                            <p>{inv.title}</p>

                        </div>
                        <div className='flex gap-2 bg-[#ff8600] h-fit p-2 rounded-md'>
                            <p className='text-sm font-semibold'>Details</p>
                            <ExternalLink size={20} />


                        </div>


                    </div>

                ))}






            </div>



        </div>
    )
}

export default ListFactures
