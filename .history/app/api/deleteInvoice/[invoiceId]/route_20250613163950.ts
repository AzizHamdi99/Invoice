import { connectDb } from "@/libs/db";
import Facture from "@/models/Facture";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { invoiceId: string } }
) {
    await connectDb();
    const invoiceId = params.invoiceId;

    try {
        const deletedInvoice = await Facture.findOneAndDelete({ id: invoiceId });

        if (!deletedInvoice) {
            return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Invoice deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Delete invoice error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
