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
      // required: [true, "Category is required"],
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
      // required: true,
    },
    purchasePriceType: {
      type: String,
      enum: ["with tax", "without tax"],
      default: "with tax",
      // required: true,
    },
    salesPrice: {
      type: Number,
      // required: [true, "Sales price is required"],
      min: [0, "Sales price cannot be negative"],
    },
    gstTaxRate: {
      type: String,
      // required: [true, "GST tax rate is required"],
    },
    measuringUnit: {
      type: String,
      // required: [true, "Measuring unit is required"],
    },
    openingStock: {
      type: Number,
      // required: [true, "Opening stock is required"],
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
      // required: true,
      // unique: true,
      trim: true,
      index: true,
    },
    HSNCode: {
      type: String,
      // required: true,
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
