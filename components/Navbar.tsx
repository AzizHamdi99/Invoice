import { UserButton } from '@clerk/nextjs'
import { Layers } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {


    return (
        <div className='flex items-center justify-between border-b border-gray-300 p-3 lg:px-32'>
            <Link className='flex items-center gap-2 italic' href={'/'}>
                <Layers size={40} className=' bg-black text-[#ff8600] rounded-full p-1' />
                <p className='text-2xl font-bold'>In<span className=' text-[#ff8600]'>Voice</span></p>


            </Link>
            <div className='flex items-center gap-3'>
                <Link className='bg-[#ff8600] px-2 py-1 rounded-md font-semibold text-center text-sm' href={"/"}>Invoices</Link>
                <UserButton
                    afterSignOutUrl='/sign-in' />


            </div>


        </div>
    )
}

export default Navbar
