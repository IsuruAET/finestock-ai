import mongoose, { Schema } from "mongoose";
import { IPurchaseOrder, IPurchaseOrderItem } from "../types/models";

// Purchase order line items
const itemSchema = new Schema<IPurchaseOrderItem>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    taxPercent: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

// Contact blocks for vendor / ship-to
const contactSchema = new Schema(
  {
    companyName: String,
    contactName: String,
    address: String,
    phone: String,
    email: String,
  },
  { _id: false }
);

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    poNumber: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    expectedDeliveryDate: { type: Date },
    vendor: contactSchema,
    shipTo: contactSchema,
    items: { type: [itemSchema], required: true },
    notes: { type: String },
    paymentTerms: { type: String, default: "Net 30" },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "PENDING_APPROVAL",
        "APPROVED",
        "ORDERED",
        "RECEIVED",
        "CANCELLED",
      ],
      default: "DRAFT",
      index: true,
    },
    subtotal: { type: Number, required: true },
    totalTax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

purchaseOrderSchema.index({ user: 1, poNumber: 1 }, { unique: true });

const PurchaseOrder = mongoose.model<IPurchaseOrder>(
  "PurchaseOrder",
  purchaseOrderSchema
);

export default PurchaseOrder;
