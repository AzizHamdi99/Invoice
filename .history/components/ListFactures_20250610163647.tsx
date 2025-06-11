import { useUser } from '@clerk/nextjs'
import React from 'react'

const ListFactures = () => {
    const { user } = useUser()
    return (
        <div className='my-5 mx-24 flex flex-col lg:grid lg:grid-cols-3'>
            <p>Mes factures</p>
            <div>

            </div>



        </div>
    )
}

export default ListFactures
