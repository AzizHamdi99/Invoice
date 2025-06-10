import User from "@/models/User"
import { error } from "console"
import { NextResponse } from "next/server"


export const addUser = async (name: string, email: string) => {

    try {
        if (!name || !email) {
            return NextResponse.json({ message: "missing data" })
        }
        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ message: "User already exist" })
        }
        const newUser = await User.create({})
    } catch (error) {

    }

}