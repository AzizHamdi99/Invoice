import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='max-h-screen flex items-center justify-center '>
            <SignIn />

        </div>
    )
}