import { connectDb } from "@/libs/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    try {
        await connectDb()
        const invoiceId = params.id
    } catch (error) {

    }

}