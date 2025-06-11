"use client"
import axios from 'axios'

import React, { use, useEffect, useState } from 'react'



const details = ({ params }: { params: Promise<{ invoiceId: string }> }) => {

    const { invoiceId } = use(params);
    console.log(invoiceId)

    const [invoice, setInvoice] = useState<any>(null)
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await axios.get(`/api/invoiceDetails/${invoiceId}`)
                console.log(res.data)
            } catch (error) {
                console.log(error)

            }
        }
        fetchInvoice()

    }, [id])
    return (
        <div>

        </div>
    )
}

export default details
