import { useUser } from '@clerk/nextjs'
import { Layers } from 'lucide-react'
import React from 'react'

const Navbar = () => {
    const { user } = useUser()

    return (
        <div>
            <div>
                <Layers size={40} className=' bg-black text-[#f3aa47] rounded-full p-1' />
                <p>In<span>Voice</span></p>


            </div>
            <div>
                <p>Factures</p>


            </div>


        </div>
    )
}

export default Navbar
