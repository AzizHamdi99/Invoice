"use client"
import axios from 'axios'

import React, { useEffect, useState } from 'react'



const details = ({ params }: { params: { invoiceId: string } }) => {

    const id = params.invoiceId

    const [invoice, setInvoice] = useState<any>(null)
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await axios.get(`/invoiceDetails/${id}`)
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
