import { useUser } from '@clerk/nextjs'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Layers } from 'lucide-react'

const ListFactures = () => {
    const { user } = useUser()
    const [name, setName] = useState("")

    console.log(name)
    return (
        <div className='my-5 mx-24 '>
            <p>Mes factures</p>
            <div className='flex flex-col gap-2 md:grid grid-cols-2 lg:grid lg:grid-cols-3 mt-3 '>
                <div >
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className='h-32 w-90 border-2 border-[#ff8600]' variant="outline"><div className=' flex flex-col items-center justify-center cursor-pointer '>
                                <p className='text-[#ff8600] text-xl'>Create Invoice</p>
                                <Layers size={60} className=' bg-black text-[#f3aa47] rounded-full p-1' />

                            </div></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>New Invoice</DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center gap-2">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="link" className="sr-only">
                                        Link
                                    </Label>
                                    <Input onChange={(e) => setName(e.target.value)}

                                    />
                                </div>
                            </div>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" disabled={name.length === 0}>
                                        Create
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>


                </div>


            </div>



        </div>
    )
}

export default ListFactures
