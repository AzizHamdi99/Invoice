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


    // const downloadPDF = async () => {
    //     const element = divRef.current;
    //     if (!element) return;

    //     try {
    //         const canvas = await html2canvas(element, {
    //             scale: 3,
    //             useCORS: true,
    //         });

    //         const imgData = canvas.toDataURL('image/png'); // FIXED MIME type

    //         const pdf = new jsPDF({
    //             orientation: 'portrait',
    //             unit: 'mm',
    //             format: 'a4',
    //         });

    //         const pdfWidth = pdf.internal.pageSize.getWidth();
    //         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    //         pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //         pdf.save(`invoice-${newInvoice?.title || 'document'}.pdf`);

    //     } catch (error) {
    //         console.error('❌ Error during PDF generation:', error);
    //     }
    // };


    const downloadPDF = async () => {
        const element = divRef.current;
        if (!element) {
            console.error('PDF Element not found');
            toast.error('PDF element not found');
            return;
        }

        if (!newInvoice) {
            console.error('Invoice data not available');
            toast.error('Invoice data not available');
            return;
        }

        console.log('Starting PDF generation...');

        try {
            // Show loading toast
            const loadingToast = toast.loading('Generating PDF...');

            // More conservative html2canvas options
            const canvas = await html2canvas(element, {
                scale: 1.5, // Reduced scale to avoid memory issues
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                removeContainer: true,
                logging: false, // Disable logging to avoid console spam
                width: element.scrollWidth,
                height: element.scrollHeight,
                onclone: (clonedDoc) => {
                    console.log('Cloning document for PDF...');

                    try {
                        // Remove all external stylesheets
                        const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
                        console.log(`Found ${links.length} stylesheets to remove`);
                        links.forEach((link, index) => {
                            console.log(`Removing stylesheet ${index + 1}: ${link.href}`);
                            link.remove();
                        });

                        // Remove style tags that might contain problematic CSS
                        const styles = clonedDoc.querySelectorAll('style');
                        console.log(`Found ${styles.length} style tags`);
                        styles.forEach((style, index) => {
                            if (style.textContent) {
                                // Check for problematic CSS functions
                                const problematicFunctions = ['oklch', 'oklab', 'lch', 'lab'];
                                const hasProblematicCSS = problematicFunctions.some(func =>
                                    style.textContent.includes(func)
                                );

                                if (hasProblematicCSS) {
                                    console.log(`Removing problematic style tag ${index + 1}`);
                                    style.remove();
                                }
                            }
                        });

                        // Apply basic inline styles to maintain appearance
                        const clonedElement = clonedDoc.body.querySelector('[data-pdf-content]') ||
                            clonedDoc.body.firstElementChild;

                        if (clonedElement) {
                            clonedElement.style.fontFamily = 'Arial, sans-serif';
                            clonedElement.style.color = '#000000';
                            clonedElement.style.backgroundColor = '#ffffff';
                            clonedElement.style.padding = '20px';

                            // Apply basic styles to common elements
                            const headers = clonedElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
                            headers.forEach(header => {
                                header.style.color = '#1a2028';
                                header.style.fontWeight = 'bold';
                            });

                            // Style elements with specific classes if they exist
                            const orangeElements = clonedElement.querySelectorAll('[class*="ff8600"], [style*="ff8600"]');
                            orangeElements.forEach(el => {
                                el.style.backgroundColor = '#ff8600';
                                el.style.color = '#ffffff';
                            });
                        }

                        console.log('Document cloning completed successfully');
                    } catch (cloneError) {
                        console.warn('Error during document cloning:', cloneError);
                        // Continue anyway, as basic rendering might still work
                    }
                }
            });

            console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);

            // Check if canvas is valid
            if (!canvas || canvas.width === 0 || canvas.height === 0) {
                throw new Error('Invalid canvas generated');
            }

            const imgData = canvas.toDataURL('image/png');

            if (!imgData || imgData === 'data:,') {
                throw new Error('Failed to generate image data');
            }

            console.log('Image data generated successfully');

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            console.log('PDF dimensions:', pdfWidth, 'x', pdfHeight);

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            const fileName = `invoice-${newInvoice?.id || newInvoice?.title || Date.now()}.pdf`;
            pdf.save(fileName);

            // Dismiss loading toast and show success
            toast.dismiss(loadingToast);
            toast.success('PDF downloaded successfully!');

            console.log('PDF generated and downloaded successfully');

        } catch (error: any) {
            console.error('❌ Detailed PDF generation error:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });

            // Show specific error message based on error type
            let errorMessage = 'Failed to generate PDF';

            if (error.message.includes('oklch') || error.message.includes('color')) {
                errorMessage = 'Color parsing error. Please try again.';
            } else if (error.message.includes('canvas') || error.message.includes('Invalid canvas')) {
                errorMessage = 'Failed to capture invoice content. Please try again.';
            } else if (error.message.includes('image') || error.message.includes('toDataURL')) {
                errorMessage = 'Failed to generate image. Please try again.';
            }

            toast.error(errorMessage);
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
                                onClick={downloadPDF}
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