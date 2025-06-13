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
        type: String,
        enum: ["Draft", "Pending", "Paid", "Unpaid", "Cancelled"],
        default: "Draft"
    },
    dueDate: {
        type: Date,
        default: Date.now()

    },
    creationDate: {
        type: Date,
        default: Date.now()

    },
    seller: {
        type: String,
        default: ""

    },
    sellerCompany: {
        type: String,
        default: ""

    },
    buyer: {
        type: String,
        default: ""

    },
    buyerCompany: {
        type: String,
        default: ""

    },
    activeTva: {
        type: Boolean,
        require: true,
        default: true
    },
    tva: {
        type: Number,
        default: 20
    },
    net: {
        type: Number,
        default: 0,

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