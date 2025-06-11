import axios from 'axios'
import React, { useEffect, useState } from 'react'



const details = ({ params }: { params: { id: string } }) => {

    const { id } = params

    const [invoice, setInvoice] = useState<any>(null)
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await axios.get(`/invoiceDetails/${id}`)
            } catch (error) {

            }
        }

    }, [id])
    return (
        <div>

        </div>
    )
}

export default details
