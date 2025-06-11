import { getUserInvoices } from "@/actions/actions"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { email } = await req.json()
    if (!email) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    const result = await getUserInvoices(email)

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ data: result.data }, { status: 200 });

}