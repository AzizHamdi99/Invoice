"use server"
import { connectDb } from "@/libs/db"
import Facture from "@/models/Facture"
import User from "@/models/User"
import { error } from "console"
import { randomBytes } from "crypto"
import { NextResponse } from "next/server"
import { title } from "process"


export const addUser = async (name: any, email: any) => {

    try {
        await connectDb()
        if (!name || !email) {
            return NextResponse.json({ message: "missing data" }, { status: 400 })
        }
        const user = await User.findOne({ email }).lean()

        if (user) {
            return NextResponse.json({ message: "User already exist" }, { status: 409 })
        }
        const newUser = await User.create({
            name,
            email

        })
        return {
            data: {
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email,
            },
            status: 201,
        };

    } catch (error) {
        console.error("Error creating user:", error);
        return { error: "Internal server error", status: 500 };

    }

}
const generateUniqueId = async () => {
    let uniqueId
    let isUnique = false
    while (!isUnique) {
        uniqueId = randomBytes(3).toString('hex')
        const existinInvoice = await Facture.findOne({ id: uniqueId })
        if (!existinInvoice) {
            isUnique = true
        }
    }
    return uniqueId
}
export const createInvoice = async (title: string, email: string | undefined) => {
    try {
        if (!title || !email) {
            return { error: "Missing data", status: 400 };
        }
        const user = await User.findOne({ email }).lean()
        if (!user) {
            return { error: "User not found", status: 404 };
        }


        const invoiceId = await generateUniqueId()
        const invoice = await Facture.create({
            id: invoiceId,
            userId: user?._id.toString(),
            title


        })
        return {
            data: {
                id: invoice.id,
                title: invoice.title,
                userId: invoice.userId,
                status: invoice.status,
                createdAt: invoice.createdAt.toISOString(),
            },
            status: 201,
        };



    } catch (error) {
        console.error("Error creating invoice:", error);
        return { error: "Internal server error", status: 500 };

    }

}


export const getUserInvoices = async (email: string | undefined) => {
    try {
        await connectDb();
        if (!email) {
            return { error: "Missing data", status: 400 };

        }
        const user = await User.findOne({ email }).lean()
        if (!user) {
            return { error: "User not found", status: 404 };

        }

        const invoices = await Facture.find({ userId: user._id }).lean()
        return {
            data: invoices.map((inv) => ({
                id: inv.id,
                title: inv.title,
                status: inv.status,
                createdAt: inv.createdAt?.toISOString() || null,
            })),
            status: 200,
        };


    } catch (error) {

        console.error("Error creating invoice:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );

    }
}
