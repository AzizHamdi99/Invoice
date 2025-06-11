import { useUser } from '@clerk/nextjs'
import React from 'react'
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
    return (
        <div className='my-5 mx-24 '>
            <p>Mes factures</p>
            <div className='flex flex-col gap-2 md:grid grid-cols-2 lg:grid lg:grid-cols-3 '>
                <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"><div className='flex flex-col items-center justify-center w-80 h-32'>
                                <p>Create Invoice</p>
                                <Layers size={40} className=' bg-black text-[#f3aa47] rounded-full p-1' />

                            </div></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Share link</DialogTitle>
                                <DialogDescription>
                                    Anyone who has this link will be able to view this.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center gap-2">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="link" className="sr-only">
                                        Link
                                    </Label>
                                    <Input
                                        id="link"
                                        defaultValue="https://ui.shadcn.com/docs/installation"
                                        readOnly
                                    />
                                </div>
                            </div>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
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
