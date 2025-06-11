import { getUserInvoices } from "@/actions/actions"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { email } = await req.json()

    const result = await getUserInvoices(email)
    return NextResponse.json(result)

}