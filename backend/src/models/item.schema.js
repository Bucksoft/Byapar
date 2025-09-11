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
    showItemInOnlineStore: {
      type: Boolean,
      default: false,
    },
    salesPriceType: {
      type: String,
      enum: ["with tax", "without tax"],
      default: "with tax",
    },
    purchasePriceType: {
      type: String,
      enum: ["with tax", "without tax"],
      default: "with tax",
    },
    salesPrice: {
      type: Number,
      min: [0, "Sales price cannot be negative"],
    },
    gstTaxRate: {
      type: String,
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
    minimumStock: {
      type: Number,
      default: 10,
    },
    stockUpdationDate: {
      type: Date,
      default: Date.now,
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
