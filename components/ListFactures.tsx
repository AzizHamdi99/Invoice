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
import { Loader2 } from "lucide-react"
import Link from 'next/link'
import toast from 'react-hot-toast'


const ListFactures = () => {
    const { user } = useUser()
    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState(false)

    const [invoices, setInvoices] = useState<any[]>([])
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    const fetchInvoices = async () => {
        if (!userEmail) return
        setLoading(true)
        try {
            const res = await axios.get("/api/invoices", { params: { email: userEmail } })
            console.log(res.data.data)
            setInvoices(res.data.data || [])

        } catch (error) {
            console.error("Error fetching invoices:", error);

        } finally {
            setLoading(false)

        }



    }



    const addInvoice = async () => {
        if (!userEmail || !title) return

        try {
            const res = await axios.post("/api/invoices", { email: userEmail, title })
            console.log(res)
            if (res.status === 201 && res.data?.invoice) {
                
                setInvoices((prev) => [...prev, res.data.invoice])
                setTitle("")
                toast.success("Invoice added successfully");
            }
        } catch (error) {
            console.error("Failed to create invoice:", error);
        }
    }


    useEffect(() => {

        fetchInvoices()
    }, [userEmail,])


    const getStatus = (status: string) => {
        switch (status) {
            case "Draft":
                return <div className='flex items-center gap-1 px-4 rounded-xl bg-white w-fit py-0.5'>
                    <FileSpreadsheet size={20} />
                    <p className='font-semibold' >Draft</p>


                </div>
            case "Pending":
                return <div className='flex items-center gap-1 px-4 rounded-xl bg-[#febf00] w-fit'>
                    <Clock4 size={20} />
                    <p className='font-semibold'  >Pending</p>


                </div>
            case "Paid":
                return <div className='flex items-center gap-1 px-4 rounded-xl bg-[#00a96e] w-fit'>
                    <CircleCheck size={20} />
                    <p className='font-semibold' >Paid</p>


                </div>
            case "Unpaid":
                return <div className='flex items-center gap-1 px-4 rounded-xl bg-[#ff5962] w-fit'>
                    <CircleX size={20} />
                    <p className='font-semibold' >Unpaid</p>


                </div>
            case "Cancelled":
                return <div className='flex items-center gap-1 px-4 rounded-xl bg-[#00b4fd] w-fit'>
                    <CircleX size={20} />
                    <p className='font-semibold' >Cancelled</p>


                </div>
            default:
                return (
                    <div className='flex items-center gap-1 px-4 rounded-xl bg-white w-fit'>
                        <p className='font-semibold' >Unknown</p>
                    </div>
                )
        }

    }

    return (
        <div className='my-10 mx-32 '>
            <p className='text-3xl font-bold'>My Invoices</p>
            <div className='flex flex-col md:grid grid-cols-2 lg:grid lg:grid-cols-3 mt-3 gap-6  '>

                <Dialog>
                    <DialogTrigger asChild className='cursor-pointer'>
                        <Button className='h-full border-2 border-[#ff8600]  flex flex-col items-center justify-center  ' variant="outline">
                            <p className='text-[#ff8600] text-2xl'>Create Invoice</p>
                            <div className=' bg-black text-[#f3aa47] rounded-full p-1'>
                                <Layers size={200} />
                            </div>
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

                {loading ? <div className="w-full flex justify-center items-center h-40">
                    <Loader2 className="animate-spin w-8 h-8 text-[#ff8600]" />
                </div> :
                    (invoices.map((inv, i) => (
                        <div key={i} className=' bg-[#eaeaea] p-5 flex justify-between rounded-md'>
                            <div className='flex flex-col gap-2'>
                                <div>
                                    {getStatus(inv.status)}
                                </div>
                                <p className='uppercase text-[#adacb2] font-medium text-[15px]'>INVOICE-{inv.id}</p>
                                <p className='font-bold text-5xl'>{inv.total.toFixed(2)}$</p>
                                <p className=' text-[#adacb2] font-medium text-[18px]'>{inv.title}</p>

                            </div>
                            <Link className='flex gap-2 bg-[#ff8600] h-fit p-2 rounded-md cursor-pointer' href={`/invoice/${inv.id}`}>
                                <p className='text-sm font-semibold'>Details</p>
                                <ExternalLink size={20} />


                            </Link>


                        </div>

                    )))}






            </div>



        </div>
    )
}

export default ListFactures
