import { UserButton } from '@clerk/nextjs'
import { Layers } from 'lucide-react'
import React from 'react'

const Navbar = () => {


    return (
        <div className='flex items-center justify-between border-b p-3'>
            <div className='flex items-center gap-2'>
                <Layers size={40} className=' bg-black text-[#f3aa47] rounded-full p-1' />
                <p className='text-xl'>In<span>Voice</span></p>


            </div>
            <div className='flex items-center gap-2'>
                <p>Factures</p>
                <UserButton />


            </div>


        </div>
    )
}

export default Navbar
