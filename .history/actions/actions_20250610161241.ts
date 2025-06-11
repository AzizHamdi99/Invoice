"use server"
import { connectDb } from "@/libs/db"
import User from "@/models/User"
import { error } from "console"
import { NextResponse } from "next/server"


export const addUser = async (name: any, email: any) => {

    try {
        await connectDb()
        if (!name || !email) {
            return NextResponse.json({ message: "missing data" }, { status: 400 })
        }
        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ message: "User already exist" }, { status: 409 })
        }
        const newUser = await User.create({
            name,
            email

        })
        return NextResponse.json({
            data: {
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email
            },
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );

    }

}