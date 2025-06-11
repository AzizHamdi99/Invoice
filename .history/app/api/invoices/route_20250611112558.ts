import { getUserInvoices } from "@/actions/actions"

export async function POST(req: Request) {
    const { email } = await req.json()

    const result = await getUserInvoices(email)
    return

}