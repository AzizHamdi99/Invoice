import { connectDb } from "@/libs/db";
import Facture from "@/models/Facture";
import { NextRequest } from "next/server";



export async function PUT(req: NextRequest, { params }: { params: { invoiceId: string } }) {

    await connectDb()
    const invoiceId = params.invoiceId

    try {
        const body = await req.json()

        const updateInvoice = await Facture.findByIdAndUpdate

    } catch (error) {

    }

}