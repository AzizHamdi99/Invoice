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
    title: {
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
        type: Number,
        default: 0
    }
    ,
    total: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    lines: [line]







},
    { timestamps: true }
)

const Facture = mongoose.models.Facture || mongoose.model("Facture", factureSchema)

export default Facture