import React, { useState } from 'react'



const details = ({ params }: { params: { id: string } }) => {

    const { id } = params

    const [invoice, setInvoice] = useState<any>(null)

    return (
        <div>

        </div>
    )
}

export default details
