"use client"
import axios from 'axios'

import React, { useEffect, useState } from 'react'



const details = ({ params }: { params: { invoiceId: string } }) => {

    const id = params.invoiceId
    console.log(id)

    const [invoice, setInvoice] = useState<any>(null)
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await axios.get(`/api/invoiceDetails/${id}`)
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
