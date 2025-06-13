import { connectDb } from "@/libs/db";
import Facture from "@/models/Facture";
import { NextRequest } from "next/server";



export async function PUT(req: NextRequest, { params }: { params: { invoiceId: string } }) {

    await connectDb()
    const invoiceId = params.invoiceId

    try {
        const body = await req.json()

        const updateInvoice = await Facture.findByIdAndUpdate({ id: invoiceId }, {             // ✅ Serialize ObjectId
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

    } catch (error) {

    }

}