import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const factureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
})

const User = new mongoose.models.User || mongoose.model("User", userSchema)

export default User