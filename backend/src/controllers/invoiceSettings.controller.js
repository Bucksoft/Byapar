import mongoose from "mongoose";
import { InvoiceSettings } from "../models/invoiceSettings.schema.js";

// Save or update invoice settings
export const saveInvoiceSettings = async (req, res) => {
  try {
    const { theme, selectedColor, textColor, options } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let settings = await InvoiceSettings.findOne({ userId, theme });

    if (settings) {
      settings.theme = theme || settings.theme;
      settings.selectedColor = selectedColor || settings.selectedColor;
      settings.textColor = textColor || settings.textColor;

      const newOptionMap = options.reduce((acc, o) => {
        acc[o.name] = o.checked;
        return acc;
      }, {});

      // Build a synchronized array
      const allOptionNames = new Set([
        ...settings.options.map((o) => o.name),
        ...options.map((o) => o.name),
      ]);

      const updatedOptions = Array.from(allOptionNames).map((name) => ({
        name,
        checked: newOptionMap[name] ?? false, // if not sent, mark as false
      }));

      settings.options = updatedOptions;
      await settings.save();
    } else {
      // New settings
      settings = new InvoiceSettings({
        userId,
        theme,
        selectedColor,
        textColor,
        options,
      });
      await settings.save();
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Invoice settings saved successfully",
        settings,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get invoice settings for a user
export const getInvoiceSettings = async (req, res) => {
  try {
    const userId = req.user?.id;
    const theme = req.params?.theme;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const id = new mongoose.Types.ObjectId(userId);

    const themes = await InvoiceSettings.findOne({ userId: id, theme });
    console.log(themes);
    if (!themes) {
      return res.status(404).json({ message: "Invoice theme not found" });
    }

    res.status(200).json(themes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
