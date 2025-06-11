import { useUser } from '@clerk/nextjs'
import React from 'react'

const ListFactures = () => {
    const { user } = useUser()
    return (
        <div className='my-5 mx-20'>
            <p></p>
            <div>

            </div>



        </div>
    )
}

export default ListFactures
