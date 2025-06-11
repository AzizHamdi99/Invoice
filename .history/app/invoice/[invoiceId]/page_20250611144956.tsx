import axios from 'axios'
import { console } from 'inspector'
import React, { useEffect, useState } from 'react'



const details = ({ params }: { params: { id: string } }) => {

    const { id } = params

    const [invoice, setInvoice] = useState<any>(null)
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await axios.get(`/invoiceDetails/${id}`)
                console.log(res)
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
