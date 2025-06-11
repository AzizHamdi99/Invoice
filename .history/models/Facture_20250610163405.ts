import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";


const line = new mongoose.Schema({
    name: {
        type: String
    },
    quantity: {
        type: Number, default: 1
    },
    unitPrice: {
        type: Number
    }
})

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
        required: true,
        default: 0
    },
    dueDate: {
        type: Date,

    },
    creationDate: {
        type: Date,

    },
    seller: {
        type: String,

    },
    sellerCompany: {
        type: String,

    },
    buyer: {
        type: String,

    },
    buyerCompany: {
        type: String,

    },
    activeTva: {
        type: Boolean,
        require: true,
        default: true
    },
    tva: {
        type: Number
    },
    net: {
        type: Number
    }
    ,
    total: {
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    lines: [line]







})

const Facture = mongoose.models.Facture || mongoose.model("Facture", factureSchema)

export default Facture