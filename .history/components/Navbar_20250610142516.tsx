import { UserButton } from '@clerk/nextjs'
import { Layers } from 'lucide-react'
import React from 'react'

const Navbar = () => {


    return (
        <div className='flex items-center justify-between border-b border-gray-300 p-3 lg:px-24'>
            <div className='flex items-center gap-2'>
                <Layers size={40} className=' bg-black text-[#f3aa47] rounded-full p-1' />
                <p className='text-2xl font-bold'>In<span className=' text-[#f3aa47]'>Voice</span></p>


            </div>
            <div className='flex items-center gap-3'>
                <p className='bg-[#f3aa47] px-2 py-1 rounded-xl font-semi-bold'>Factures</p>
                <UserButton />


            </div>


        </div>
    )
}

export default Navbar
