import { UserButton } from '@clerk/nextjs'
import { Layers } from 'lucide-react'
import React from 'react'

const Navbar = () => {


    return (
        <div className='flex items-center justify-between'>
            <div>
                <Layers size={40} className=' bg-black text-[#f3aa47] rounded-full p-1' />
                <p>In<span>Voice</span></p>


            </div>
            <div>
                <p>Factures</p>
                <UserButton />


            </div>


        </div>
    )
}

export default Navbar
