import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["product", "service"],
      default: "product",
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    serviceCode: {
      type: String,
    },
    SACCode: {
      type: String,
    },
    showItemInOnlineStore: {
      type: Boolean,
      default: false,
    },
    salesPriceType: {
      type: String,
      enum: ["with tax", "without tax"],
      default: "without tax",
    },
    purchasePriceType: {
      type: String,
      enum: ["with tax", "without tax"],
      default: "without tax",
    },
    salesPrice: {
      type: Number,
      min: [0, "Sales price cannot be negative"],
    },
    salesPriceForDealer: {
      type: Number,
      min: [0, "Sales price cannot be negative"],
    },
    purchasePrice: {
      type: Number,
      min: [0, "Sales price cannot be negative"],
    },
    gstTaxRate: {
      type: String,
    },
    gstAmount: {
      type: String,
      default: "0",
    },
    measuringUnit: {
      type: String,
    },
    openingStock: {
      type: Number,
      min: [0, "Opening stock cannot be negative"],
    },
    currentStock: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    itemCode: {
      type: String,
      trim: true,
      index: true,
    },
    HSNCode: {
      type: String,
      trim: true,
      index: true,
    },
    asOfDate: {
      type: Date,
      default: Date.now,
    },
    godown: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    invoiceNo: {
      type: String,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCredential",
    },
    fileURLs: [
      {
        type: String,
      },
    ],
    remarks: {
      type: String,
    },
    lowStockQuantity: {
      type: Number,
      default: 10,
    },
    stockUpdationDate: {
      type: Date,
      default: Date.now,
    },
    isPOSItem: {
      type: Boolean,
      default: false,
    },
    mrp: {
      type: Number,
      min: [0, "MRP cannot be negative"],
      default: 0,
    },
  },
  { timestamps: true }
);

itemSchema.index({ category: 1, itemName: 1 });
itemSchema.pre("save", function (next) {
  if (this.isNew) {
    this.quantity = this.openingStock || 0;
  }
  next();
});
itemSchema.pre("save", function (next) {
  if (this.isNew) {
    this.quantity = this.openingStock || 0;
    this.currentStock = this.openingStock || 0;
  }
  next();
});

export const Item = mongoose.model("Item", itemSchema);
