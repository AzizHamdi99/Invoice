import { createInvoice, getUserInvoices } from "@/actions/actions"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
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
    try {
        const { email, title } = await req.json();

        if (!email || !title) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const result = await createInvoice(title, email);

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }

        return NextResponse.json(
            { invoice: result.data, message: "Invoice created" },
            { status: result.status }
        );
    } catch (error) {
        console.error("POST /api/invoices error:", error);
        return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
}
