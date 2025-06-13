import { connectDb } from "@/libs/db";
import Facture from "@/models/Facture";
import { NextRequest, NextResponse } from "next/server";



export async function PUT(req: NextRequest, { params }: { params: { invoiceId: string } }) {

    await connectDb()
    const invoiceId = params.invoiceId

    try {
        const body = await req.json()

        const updatedInvoice = await Facture.findOneAndUpdate({ id: invoiceId }, {             // ✅ Serialize ObjectId
            total: body.total,        // ✅ Serialize userId
            status: body.status,
            createdAt: body.createdAt, // ✅ Serialize Date
            activeTva: body.activeTva ?? false,
            lines: body.lines,
            seller: body.seller,
            sellerCompany: body.sellerCompany,
            buyer: body.buyer,
            buyerCompany: body.buyerCompany,
            tva: body.tva,
            net: body.net,
            dueDate: body.dueDate
        })
        if (!updatedInvoice) {
            return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Invoice updated", invoice: updatedInvoice });

    } catch (error: any) {
        console.error("Update invoice error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });

    }

}