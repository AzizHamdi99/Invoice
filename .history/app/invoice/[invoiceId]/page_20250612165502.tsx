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

import { Switch } from "@/components/ui/switch"



const details = ({ params }: { params: { invoiceId: string } }) => {

    const invoiceId = params.invoiceId;
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
    useEffect(() => {
        console.log(newInvoice)
    }, [newInvoice])


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
                    <div className='flex items-center gap-2 md:gap-4'>
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
                <div className='flex flex-col gap-2 md:flex md:justify-between md:flex-row my-5 '>
                    <div className='flex flex-col gap-4'>
                        <div className='bg-[#eaeaea] p-5 rounded-md flex flex-col gap-2'>
                            <div className='flex items-center justify-between gap-4'>
                                <p className='text-sm bg-[#ff8600] px-2 py-0.5 rounded-md '>Summary of Totals</p>
                                <div className='flex items-center gap-2'>
                                    <p>VAT(%)</p>
                                    <Switch className='bg-white border-[1px] border-black'
                                        onCheckedChange={(checked) =>
                                            setNewInvoice((prev: any) => ({
                                                ...prev,
                                                activeTva: checked,
                                            }))
                                        }
                                        checked={newInvoice?.activeTva}

                                    />
                                    {newInvoice?.activeTva && <input className='w-17 p-1 bg-white rounded-xl' type="number" />}

                                </div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center justify-between'>
                                    <p>Total Excl. Tax</p>
                                    <p>{newInvoice?.net}$</p>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p>VAT({newInvoice?.tva ?? 0}%)</p>
                                    <p>tva</p>
                                </div>
                                <div className='flex items-center justify-between font-bold'>
                                    <p>Total Incl.Tax</p>
                                    <p>{newInvoice?.total}$</p>

                                </div>

                            </div>



                        </div>
                        <div className='flex flex-col gap-3 p-5 bg-[#eaeaea] rounded-md'>
                            <p className='text-sm bg-[#ff8600] px-2 py-0.5 rounded-md '>Issuer</p>
                            <input type="text" placeholder='Company name' />
                            <textarea name="" id="" placeholder='Company Address'></textarea>
                            <p className='text-sm bg-[#ff8600] px-2 py-0.5 rounded-md w-fit '> Client</p>
                            <input type="text" placeholder=' Client name' />
                            <textarea name="" id="" placeholder='Client address'></textarea>

                        </div>

                    </div>
                    <div>
                        <div>
                            products
                        </div>
                        <div>
                            pdf
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default details
