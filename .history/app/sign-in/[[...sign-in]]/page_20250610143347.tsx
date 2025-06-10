import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='flex items-center justify-center m-auto'>
            <div className=''>
                <SignIn />
            </div>

        </div>
    )
}