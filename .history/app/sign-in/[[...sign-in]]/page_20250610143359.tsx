import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='flex items-center justify-center m-auto'>
            <div className='flex flex-col items-center justify-center'>
                <SignIn />
            </div>

        </div>
    )
}