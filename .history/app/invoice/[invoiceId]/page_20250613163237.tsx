"use client"
import Navbar from '@/components/Navbar';
import axios from 'axios'
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';

import React, { use, useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Switch } from "@/components/ui/switch"
import { Value } from '@radix-ui/react-select';




const details = ({ params }: { params: { invoiceId: string } }) => {

    const invoiceId = params.invoiceId;


    const [invoice, setInvoice] = useState<any>(null)
    const [newInvoice, setNewInvoice] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    // const [hasChanged, setHasChanged] = useState(false)

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
        if (!newInvoice) return;
        const net = newInvoice.lines.reduce(
            (sum: number, item: any) => sum + (item.unitPrice || 0) * (item.quantity || 0),
            0
        );

        const tvaAmount = newInvoice.activeTva ? net * (newInvoice.tva ?? 0) / 100 : 0;
        const total = net + tvaAmount;

        setNewInvoice((prev: any) => ({
            ...prev,
            net: net.toFixed(2),
            total: total.toFixed(2),
        }));



    }, [newInvoice?.lines, newInvoice?.tva, newInvoice?.activeTva])
    /*const isEqual = (invoice: any, newInvoice: any) => {
        return JSON.stringify(invoice) === JSON.stringify(newInvoice);
    };*/

    /*useEffect(() => {
        if (!invoice || !newInvoice) return;
        const changed = !isEqual(invoice, newInvoice); // now deep and safe
        setHasChanged(changed);
    }, [invoice, newInvoice]);*/
    useEffect(() => {
        console.log(newInvoice)
        console.log(invoice)
    }, [newInvoice, invoice])


    const handleProductChange = (index: number, field: string, value: string) => {
        const updatedProducts = [...newInvoice.lines];
        updatedProducts[index][field] = field === "unitPrice" || field === "quantity" ? parseFloat(value) : value;
        setNewInvoice((prev: any) => ({ ...prev, lines: updatedProducts }));
    };
    const handleAddProduct = () => {
        const newProduct = { quantity: 1, name: "", unitPrice: 0 }
        setNewInvoice((prev: any) => ({
            ...prev,
            lines: [...prev.lines, newProduct],
        }));

    }
    const handleRemoveProduct = (index: number) => {
        const updatedProducts = [...newInvoice.lines];
        updatedProducts.splice(index, 1);
        setNewInvoice((prev: any) => ({ ...prev, lines: updatedProducts }));
    };
    const handleSave = async () => {
        try {
            await axios.put(`/api/updateInvoice/${invoiceId}`, newInvoice);
            alert("Invoice updated!");
        } catch (error) {
            console.error("Save error:", error);
            alert("Error saving invoice.");
        }
    };


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
                        <Select onValueChange={(value) =>
                            setNewInvoice((prev: any) => ({ ...prev, status: value }))
                        } value={newInvoice?.status}>
                            <SelectTrigger className="w-[100px] cursor-pointer">
                                <SelectValue placeholder={newInvoice?.status} />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Unpaid">Unpaid</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <button className={`flex items-center gap-4 px-5 py-1 rounded-md font-medium bg-[#ff8600] cursor-pointer 
                            }`} onClick={handleSave}>
                            <p>Save</p>
                            <Save size={20} />
                        </button>
                        <div className='bg-[#ff8600] rounded-md p-1 px-2 cursor-pointer'>
                            <Trash2 size={20} />

                        </div>

                    </div>



                </div>
                <div className='flex flex-col gap-3 md:flex md:flex-row my-5 md:justify-between '>
                    <div className='flex flex-col gap-4 md:w-140'>
                        <div className='bg-[#eaeaea] p-5 rounded-md flex flex-col gap-2'>
                            <div className='flex items-center justify-between gap-4'>
                                <p className='text-sm bg-[#ff8600] px-2 py-0.5 rounded-md font-semibold '>Summary of Totals</p>
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
                                    {newInvoice?.activeTva && <input className='w-17 p-1 bg-white rounded-xl' type="number" onChange={(e) => setNewInvoice((prev: any) => ({ ...prev, tva: parseFloat(e.target.value) }))} value={newInvoice?.tva} />}

                                </div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center justify-between'>
                                    <p>Total Excl. Tax</p>
                                    <p>{newInvoice?.net}$</p>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p>VAT({newInvoice?.tva ?? 0}%)</p>
                                    <p>
                                        {newInvoice?.activeTva
                                            ? (parseFloat(newInvoice?.net || 0) * (newInvoice?.tva || 0) / 100).toFixed(2)
                                            : "0.00"} €
                                    </p>
                                </div>
                                <div className='flex items-center justify-between font-bold'>
                                    <p>Total Incl.Tax</p>
                                    <p>{newInvoice?.total}$</p>

                                </div>

                            </div>



                        </div>
                        <div className='flex flex-col gap-5 p-5 bg-[#eaeaea] rounded-md'>
                            <p className='text-sm bg-[#ff8600] px-2 py-0.5 rounded-md w-fit font-semibold '>Issuer</p>
                            <input type="text" placeholder='Company name' className='bg-white p-3 rounded-xl outline-none' onChange={(e) => setNewInvoice((prev: any) => ({ ...prev, seller: e.target.value }))} value={newInvoice?.seller} />
                            <textarea name="" id="" placeholder='Company Address' className='bg-white p-3 rounded-md outline-none h-24' onChange={(e) => setNewInvoice((prev: any) => ({ ...prev, sellerCompany: e.target.value }))} value={newInvoice?.sellerCompany}></textarea>
                            <p className='text-sm bg-[#ff8600] px-2 py-0.5 rounded-md w-fit  font-semibold' > Client</p>
                            <input type="text" placeholder=' Client name' className='bg-white p-3 rounded-xl outline-none' onChange={(e) => setNewInvoice((prev: any) => ({ ...prev, buyer: e.target.value }))} value={newInvoice?.buyer} />
                            <textarea name="" id="" placeholder='Client address' className='bg-white p-3 rounded-md outline-none h-24' onChange={(e) => setNewInvoice((prev: any) => ({ ...prev, buyerCompany: e.target.value }))} value={newInvoice?.buyerCompany}></textarea>
                            <p className='text-sm bg-[#ff8600] px-2 py-0.5 rounded-md w-fit  font-semibold'> Invoice Date</p>
                            <input type="date" className='bg-white p-3 rounded-md' onChange={(e) => setNewInvoice((prev: any) => ({ ...prev, createdAt: e.target.value }))} value={newInvoice?.createdAt} />
                            <p className='text-sm bg-[#ff8600] px-2 py-0.5 rounded-md w-fit  font-semibold'> Due Date</p>
                            <input type="date" className='bg-white p-3 rounded-md' onChange={(e) => setNewInvoice((prev: any) => ({ ...prev, dueDate: e.target.value }))} value={newInvoice?.dueDate} />
                        </div>

                    </div>
                    <div className='w-full'>
                        <div className='flex flex-col gap-5 p-5 bg-[#eaeaea] rounded-md w-full py-10' >
                            <div className='flex items-center justify-between'>
                                <p className='text-sm bg-[#ff8600] px-2 py-0.5 rounded-md w-fit  font-semibold'>Products / Services</p>
                                <div className='bg-[#ff8600] rounded-md p-1 px-2 cursor-pointer' onClick={handleAddProduct}>
                                    <Plus />
                                </div>

                            </div>
                            <div className='flex flex-col gap-3 px-4'>
                                <div className='grid grid-cols-5 gap-6 font-medium text-[#777978]'>
                                    <p>Quantity</p>
                                    <p>Description</p>
                                    <p>Unit Price</p>
                                    <p>SubTotal</p>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    {newInvoice?.lines.map((item: any, index: number) => (
                                        <div key={index} className='grid grid-cols-5 gap-6'>

                                            <input type="number" value={item?.quantity} className='bg-white rounded-md px-2  ' onChange={(e) => handleProductChange(index, "quantity", e.target.value)} />
                                            <input type="text" value={item?.name} className='bg-white rounded-md px-2 ' onChange={(e) => handleProductChange(index, "name", e.target.value)} />
                                            <input type="number" value={item?.unitPrice} className='bg-white rounded-md px-2 ' onChange={(e) => handleProductChange(index, "unitPrice", e.target.value)} />
                                            <div className='bg-white rounded-md px-1 '>{!item.unitPrice ? "0.00" : (item?.unitPrice * item.quantity).toFixed(2)}</div>
                                            <div className='bg-[#ff8600] p-1 rounded-full w-fit cursor-pointer ' onClick={() => handleRemoveProduct(index)}>
                                                <Trash2 />
                                            </div>


                                        </div>
                                    ))}
                                </div>

                            </div>


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
