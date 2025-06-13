import { connectDb } from "@/libs/db";
import Facture from "@/models/Facture";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, { params }: { params: { invoiceId: string } }) {
    await connectDb()
    const invoiceId = params.invoiceId
    try {
        const deletedInvoice = await Facture.findOneAndDelete({ id: invoiceId })
        if (deletedInvoice) {

        }

    } catch (error) {

    }

}