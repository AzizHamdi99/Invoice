import { connectDb } from "@/libs/db";
import Facture from "@/models/Facture";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    try {
        await connectDb()
        const invoiceId = params.id

        const invoice = await Facture.findOne({ id: invoiceId }).lean()

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
        }

        return NextResponse.json({ invoice }, { status: 200 })
    } catch (error) {

    }

}