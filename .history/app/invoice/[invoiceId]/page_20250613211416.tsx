"use client"
import Navbar from '@/components/Navbar';
import axios from 'axios'
import { ArrowDownFromLine, Download, Layers, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast'

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
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/libs/utils';

import { useRef } from 'react';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';




const details = ({ params }: { params: { invoiceId: string } }) => {

    const invoiceId = params.invoiceId;
    const divRef = useRef<HTMLDivElement>(null);

    const [invoice, setInvoice] = useState<any>(null)
    const [newInvoice, setNewInvoice] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    // const [hasChanged, setHasChanged] = useState(false)
    const router = useRouter();

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
            toast.success("Invoice updated successfully!");
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Error updating invoice.");

        }
    };

    const handelDelete = async () => {
        try {
            const res = await axios.delete(`/api/deleteInvoice/${newInvoice?.id}`);
            if (res.status === 200) {
                toast.success("Invoice deleted successfully");
                router.push('/');
            } else {
                toast.error("Failed to delete invoice");
            }
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error("An error occurred while deleting");
        }
    };

    const printInvoice = () => {
        const element = divRef.current;
        if (!element) {
            console.error('Print Element not found');
            toast.error('Print element not found');
            return;
        }

        if (!newInvoice) {
            console.error('Invoice data not available');
            toast.error('Invoice data not available');
            return;
        }

        try {
            // Create a new window for printing
            const printWindow = window.open('', '_blank');

            if (!printWindow) {
                toast.error('Please allow pop-ups to print the invoice');
                return;
            }

            // Get the HTML content of the invoice
            const invoiceContent = element.innerHTML;

            // Create the print document
            const printDocument = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Invoice - ${newInvoice?.id || 'N/A'}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.5;
                        color: #000000;
                        background: white;
                        padding: 20px;
                    }
                    
                    .print-container {
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    
                    /* Header styles */
                    .invoice-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                    }
                    
                    .logo-section {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    
                    .logo-icon {
                        width: 40px;
                        height: 40px;
                        background-color: #000000;
                        color: #ff8600;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                    }
                    
                    .company-name {
                        font-size: 24px;
                        font-weight: bold;
                        font-style: italic;
                    }
                    
                    .company-accent {
                        color: #ff8600;
                    }
                    
                    .invoice-title {
                        font-size: 48px;
                        font-weight: bold;
                        color: #1a2028;
                        text-transform: uppercase;
                        margin-top: 10px;
                    }
                    
                    .invoice-details {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        align-items: flex-end;
                    }
                    
                    .invoice-number {
                        background-color: #e7e7e7;
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 14px;
                    }
                    
                    .date-info {
                        font-size: 16px;
                    }
                    
                    .date-label {
                        font-weight: bold;
                        color: #222328;
                    }
                    
                    /* Parties section */
                    .parties-section {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }
                    
                    .party-info {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                    
                    .party-label {
                        background-color: #e7e7e7;
                        padding: 0px
                        border-radius: 12px;
                        color: #646568;
                        font-size: 18px;
                        width: fit-content;
                    }
                    
                    .party-name {
                        font-weight: bold;
                        font-size: 16px;
                        color: #222328;
                    }
                    
                    .party-company {
                        color: #8a8b8b;
                    }
                    
                    /* Table styles */
                    .invoice-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    
                    .table-header {
                        border-bottom: 1px solid #ccc;
                        padding: 12px;
                        font-weight: bold;
                        color: #7c8080;
                        text-align: left;
                    }
                    
                    .table-cell {
                        padding: 12px;
                        color: #656565;
                        font-weight: 500;
                    }
                    
                    .table-row-even {
                        background-color: #f9f9f9;
                    }
                    
                    /* Totals section */
                    .totals-section {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 20px;
                    }
                    
                    .totals-labels {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        font-weight: bold;
                        font-size: 16px;
                    }
                    
                    .totals-values {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        text-align: right;
                    }
                    
                    .total-final {
                        background-color: #ff8600;
                        color: white;
                        padding: 4px 8px;
                        border-radius: 12px;
                    }
                    
                    /* Print-specific styles */
                    @media print {
                        body {
                            padding: 0;
                        }
                        
                        .print-container {
                            max-width: none;
                        }
                        
                        .invoice-title {
                            font-size: 36px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    <div class="invoice-header">
                        <div>
                            <div class="logo-section">
                                <div class="logo-icon"></div>
                                <div class="company-name">
                                    In<span class="company-accent">Voice</span>
                                </div>
                            </div>
                            <div class="invoice-title">Invoice</div>
                        </div>
                        <div class="invoice-details">
                            <div class="invoice-number">invoice°${newInvoice?.id || 'N/A'}</div>
                            <div class="date-info">
                                <span class="date-label">Date:</span> ${newInvoice?.createdAt ? formatDate(newInvoice?.createdAt) : "Invalid date"}
                            </div>
                            <div class="date-info">
                                <span class="date-label">Due date:</span> ${newInvoice?.dueDate ? formatDate(newInvoice?.dueDate) : "Invalid date"}
                            </div>
                        </div>
                    </div>
                    
                    <div class="parties-section">
                        <div class="party-info">
                            <div class="party-label">Issuer</div>
                            <div class="party-name">${newInvoice?.seller || 'N/A'}</div>
                            <div class="party-company">${newInvoice?.sellerCompany || ''}</div>
                        </div>
                        <div class="party-info" style="align-items: flex-end;">
                            <div class="party-label">Client</div>
                            <div class="party-name">${newInvoice?.buyer || 'N/A'}</div>
                            <div class="party-company">${newInvoice?.buyerCompany || ''}</div>
                        </div>
                    </div>
                    
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th class="table-header" style="width: 10%;">#</th>
                                <th class="table-header" style="width: 30%;">Description</th>
                                <th class="table-header" style="width: 20%;">Quantity</th>
                                <th class="table-header" style="width: 20%;">Unit Price</th>
                                <th class="table-header" style="width: 20%;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${newInvoice?.lines?.map((item, i) => `
                                <tr class="${i % 2 !== 0 ? 'table-row-even' : ''}">
                                    <td class="table-cell">${i + 1}</td>
                                    <td class="table-cell">${item?.name || 'N/A'}</td>
                                    <td class="table-cell">${item?.quantity || '0'}</td>
                                    <td class="table-cell">${item?.unitPrice || '0.00'}</td>
                                    <td class="table-cell">${!item.unitPrice ? "0.00" : (item?.unitPrice * item.quantity).toFixed(2)}$</td>
                                </tr>
                            `).join('') || '<tr><td colspan="5" class="table-cell">No items</td></tr>'}
                        </tbody>
                    </table>
                    
                    <div class="totals-section">
                        <div class="totals-labels">
                            <div>Total Excl. Tax</div>
                            <div>VAT(${newInvoice?.tva || 0}%)</div>
                            <div>Total Incl. Tax</div>
                        </div>
                        <div class="totals-values">
                            <div>${newInvoice?.net || '0.00'}$</div>
                            <div>
                                ${newInvoice?.activeTva
                    ? (parseFloat(newInvoice?.net || 0) * (newInvoice?.tva || 0) / 100).toFixed(2)
                    : "0.00"}$
                            </div>
                            <div class="total-final">${newInvoice?.total || '0.00'}$</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

            // Write the document to the new window
            printWindow.document.write(printDocument);
            printWindow.document.close();

            // Wait for the document to load, then print
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    // Close the window after printing (optional)
                    printWindow.onafterprint = () => {
                        printWindow.close();
                    };
                }, 500);
            };

            toast.success('Print dialog opened!');

        } catch (error) {
            console.error('Print error:', error);
            toast.error('Failed to open print dialog');
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
                        <Dialog>
                            <DialogTrigger className='bg-[#ff8600] rounded-md p-1 px-2 cursor-pointer'>
                                <Trash2 size={20} />

                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Task</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this invoice
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button className='cursor-pointer' variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="button" className='cursor-pointer bg-[#ff8600]' onClick={handelDelete}>Delete</Button>
                                </DialogFooter>
                            </DialogContent>

                        </Dialog>

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
                    <div className='w-full flex flex-col gap-4'>
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
                                    <p>Total</p>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    {newInvoice?.lines.map((item: any, index: number) => (
                                        <div key={index} className='grid grid-cols-5 gap-6'>

                                            <input type="number" value={item?.quantity} className='bg-white rounded-md px-2  ' onChange={(e) => handleProductChange(index, "quantity", e.target.value)} />
                                            <input type="text" value={item?.name} className='bg-white rounded-md px-2 ' onChange={(e) => handleProductChange(index, "name", e.target.value)} />
                                            <input type="number" value={item?.unitPrice} className='bg-white rounded-md px-2 ' onChange={(e) => handleProductChange(index, "unitPrice", e.target.value)} />
                                            <div className='font-bold px-1 '>{!item.unitPrice ? "0.00" : (item?.unitPrice * item.quantity).toFixed(2)}$</div>
                                            <div className='bg-[#ff8600] p-1 rounded-full w-fit cursor-pointer ' onClick={() => handleRemoveProduct(index)}>
                                                <Trash2 />
                                            </div>


                                        </div>
                                    ))}
                                </div>

                            </div>


                        </div>
                        <div className="p-5 border-2 border-dashed flex flex-col gap-4 rounded-md bg-[#ffffff] text-[#000000]">
                            <div
                                className="flex gap-2 bg-[#ff8600] w-fit px-3 py-1 rounded-md font-medium cursor-pointer"
                                onClick={printInvoice}
                            >
                                Invoice PDF
                                <ArrowDownFromLine size={20} />
                            </div>

                            <div className="flex flex-col gap-5 px-5" ref={divRef} data-pdf-content="true">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 italic">
                                            <Layers size={40} className="bg-[#000000] text-[#ff8600] rounded-full p-1" />
                                            <p className="text-2xl font-bold">
                                                In<span className="text-[#ff8600]">Voice</span>
                                            </p>
                                        </div>
                                        <p className="uppercase text-6xl font-bold text-[#1a2028]">Invoice</p>
                                    </div>

                                    <div className="uppercase flex flex-col gap-1.5 items-end">
                                        <p className="bg-[#e7e7e7] px-2 py-0.5 rounded-xl w-fit text-[#000000]">
                                            invoice°{newInvoice?.id}
                                        </p>
                                        <p className="text-[18px]">
                                            <span className="text-[#222328] font-bold">Date:</span>{" "}
                                            {newInvoice?.createdAt ? formatDate(newInvoice?.createdAt) : "Invalid date"}
                                        </p>
                                        <p className="text-[18px]">
                                            <span className="text-[#222328] font-bold">Due date:</span>{" "}
                                            {newInvoice?.dueDate ? formatDate(newInvoice?.dueDate) : "Invalid date"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1.5 items-start">
                                        <p className="bg-[#e7e7e7] px-4 py-0.5 rounded-xl w-fit text-[#646568]">Issuer</p>
                                        <p className="text-[#222328] font-bold text-[18px]">{newInvoice?.seller}</p>
                                        <p className="text-[#8a8b8b]">{newInvoice?.sellerCompany}</p>
                                    </div>

                                    <div className="flex flex-col gap-1.5 items-end">
                                        <p className="bg-[#e7e7e7] px-4 py-0.5 rounded-xl w-fit text-[#646568]">Client</p>
                                        <p className="text-[#222328] font-bold text-[18px]">{newInvoice?.buyer}</p>
                                        <p className="text-[#8a8b8b]">{newInvoice?.buyerCompany}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="grid grid-cols-[1fr_2fr_2fr_2fr_2fr] border-b-[1px] p-3 text-[#7c8080] font-semibold">
                                        <p className="text-transparent">.</p>
                                        <p>Description</p>
                                        <p>Quantity</p>
                                        <p>Unit Price</p>
                                        <p>Total</p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {newInvoice?.lines?.map((item: any, i: number) => (
                                            <div
                                                key={i}
                                                className={`grid grid-cols-[1fr_2fr_2fr_2fr_2fr] p-3 text-[#656565] font-medium ${i % 2 !== 0 ? "bg-[#d9d9d9]" : "bg-[#ffffff]"
                                                    }`}
                                            >
                                                <p>{i + 1}</p>
                                                <p>{item?.name}</p>
                                                <p>{item?.quantity}</p>
                                                <p>{item?.unitPrice}</p>
                                                <p>{!item.unitPrice ? "0.00" : (item?.unitPrice * item.quantity).toFixed(2)}$</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between my-4">
                                    <div className="font-bold text-[18px] flex flex-col gap-2">
                                        <p>Total Excl. Tax</p>
                                        <p>VAT({newInvoice?.tva}%)</p>
                                        <p>Total Incl. Tax</p>
                                    </div>
                                    <div className="flex flex-col gap-2 text-[18px] font-semibold items-center">
                                        <p>{newInvoice?.net}$</p>
                                        <p>
                                            {newInvoice?.activeTva
                                                ? (parseFloat(newInvoice?.net || 0) * (newInvoice?.tva || 0) / 100).toFixed(2)
                                                : "0.00"}{" "}
                                            $
                                        </p>
                                        <p className="bg-[#ff8600] rounded-xl px-2">{newInvoice?.total}$</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}


export default details