"use client"
import axios from 'axios'

import React, { use, useEffect, useState } from 'react'



const details = ({ params }: { params: Promise<{ invoiceId: string }> }) => {

    const { invoiceId } = use(params);
    console.log(invoiceId)

    const [invoice, setInvoice] = useState<any>(null)
    const [newInvoice, setNewInvoice] = useState<any>(null)
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await axios.get(`/api/invoiceDetails/${invoiceId}`)
                setInvoice(res.data.invoice)
                setNewInvoice(res.data.invoice)
                console.log(invoice)


            } catch (error) {
                console.log(error)

            }
        }
        fetchInvoice()

    }, [invoiceId])
    return (
        <div>

        </div>
    )
}

export default details
