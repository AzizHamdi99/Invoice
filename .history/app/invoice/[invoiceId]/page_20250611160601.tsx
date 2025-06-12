"use client"
import Navbar from '@/components/Navbar';
import axios from 'axios'
import { Loader2, Save, Trash2 } from 'lucide-react';

import React, { use, useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



const details = ({ params }: { params: Promise<{ invoiceId: string }> }) => {

    const { invoiceId } = use(params);
    console.log(invoiceId)

    const [invoice, setInvoice] = useState<any>(null)
    const [newInvoice, setNewInvoice] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`/api/invoiceDetails/${invoiceId}`)
                setInvoice(res.data.invoice)
                setNewInvoice(res.data.invoice)
                setLoading(false)



            } catch (error) {
                console.log(error)

            }
        }
        fetchInvoice()

    }, [invoiceId])
    console.log(invoice)

    if (loading) {
        return (<div className="w-full flex justify-center items-center h-screen">
            <Loader2 className="animate-spin w-8 h-8 text-[#ff8600]" />
        </div>)
    }

    return (
        <div>
            <Navbar />
            <div className='mx-4 lg:mx-32 my-6'>
                <div className='flex items-center justify-between'>
                    <p className='uppercase bg-[#eaeaea] px-3 font-normal rounded-xl'>invoice-{newInvoice?.id}</p>
                    <div className='flex items-center gap-4'>
                        <Select >
                            <SelectTrigger className="w-[100px] cursor-pointer">
                                <SelectValue placeholder={newInvoice?.status} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Unpaid">Unpaid</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <button className='flex items-center gap-4 px-5 py-1 rounded-md font-medium bg-[#ff8600] cursor-pointer'>
                            <p>Save</p>
                            <Save size={20} />
                        </button>
                        <div className='bg-[#ff8600] rounded-md p-1 px-2 cursor-pointer'>
                            <Trash2 size={20} />

                        </div>

                    </div>



                </div>
                <div>
                    <div>
                        <div>
                            <p>Summary of Totals</p>
                            <div>
                                <p>TVA(%)</p>
                            </div>


                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default details
