import { createInvoice, getUserInvoices } from "@/actions/actions"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
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

export async function POST(req: NextRequest) {
    const { email, title } = await req.json();

    if (!email || !title) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await createInvoice(title, email);

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Invoice created' }, { status: 201 });
}