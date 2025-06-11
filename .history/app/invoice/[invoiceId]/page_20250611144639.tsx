import React, { useEffect, useState } from 'react'



const details = ({ params }: { params: { id: string } }) => {

    const { id } = params

    const [invoice, setInvoice] = useState<any>(null)
    useEffect(() => {

    }, [])
    return (
        <div>

        </div>
    )
}

export default details
