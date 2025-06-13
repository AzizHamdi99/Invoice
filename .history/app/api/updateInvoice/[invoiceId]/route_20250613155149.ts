import { connectDb } from "@/libs/db";
import { NextRequest } from "next/server";



export async function PUT(req: NextRequest, { params }: { params: { invoiceId: string } }) {

    await connectDb()
    const invoiceId = params.invoiceId

    try {
        const body = await req.json()

    } catch (error) {

    }

}