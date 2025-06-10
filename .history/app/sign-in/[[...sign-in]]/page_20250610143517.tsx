import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='m-wflex items-center justify-center '>
            <SignIn />

        </div>
    )
}