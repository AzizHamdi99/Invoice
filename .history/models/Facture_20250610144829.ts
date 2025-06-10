import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const factureSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true

    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        require: true
    },
    creationDate: {
        type: Date,
        required: true
    }
    seller: {
        type: String
    }



})

const User = new mongoose.models.User || mongoose.model("User", userSchema)

export default User