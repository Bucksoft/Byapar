import { salesInvoiceSchema } from "../config/validation.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";
import Party from "../models/party.schema.js";
import { Item } from "../models/item.schema.js";
import mongoose from "mongoose";
import { parseDate } from "../../src/utils/date.js";
import { getFinancialYearRange } from "../utils/financialYear.js";
import { sendInvoiceByEmail } from "../utils/mail.js";
import pdf from "html-pdf-node";
import pkg from "whatsapp-web.js";
import qrcode from "qrcode";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client, LocalAuth } = pkg;

let qrCodeString = null;
let isReady = false;
let qrPromiseResolve = null;

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./.wwebjs_auth",
  }),
  puppeteer: {
    headless: true,
    executablePath: process.env.CHROM_PATH,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--disable-extensions",
      "--disable-infobars",
      "--window-size=1280,800",
    ],
  },
});

client.on("qr", (qr) => {
  qrCodeString = qr;
  isReady = false;

  if (qrPromiseResolve) {
    qrPromiseResolve(qr);
    qrPromiseResolve = null;
  }
});

client.on("ready", () => {
  console.log(" WhatsApp client is ready!");
  isReady = true;
  qrCodeString = null;
});

client.on("auth_failure", (msg) => {
  console.error(" Authentication failed:", msg);
  isReady = false;
  qrCodeString = null;
});

client.initialize();

// CONTROLLER TO CREATE A SALES INVOICE
export async function createSalesInvoice(req, res) {
  try {
    const data = req.body;
    const partyId = new mongoose.Types.ObjectId(data?.partyId);
    const party = await Party.findOne({
      _id: partyId,
      businessId: req.params?.id,
    });

    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Party doesn't exists" });
    }

    // Find the invoice for this business if it exists
    const existingInvoice = await SalesInvoice.findOne({
      businessId: req.params.id,
      salesInvoiceNumber: Number(data?.salesInvoiceNumber),
    });

    // SALES INVOICE MEIN STOCK KAM HOTA HAI, AGR PRODUCT HAI TO WRNA SERVICE KE CASE MEIN NHI HOTA
    for (const soldItem of data?.items) {
      if (soldItem.itemType === "product") {
        const item = await Item.findById(soldItem?._id);
        if (!item) {
          return res.status(400).json({
            success: false,
            msg: `Item not found : ${item?.itemName}`,
          });
        }
        // if (item?.currentStock < soldItem.quantity) {
        //   return res.status(400).json({
        //     success: false,
        //     msg: `Insufficient stock for ${item?.itemName}`,
        //   });
        // }
        await Item.findByIdAndUpdate(soldItem?._id, {
          $inc: { currentStock: -soldItem?.quantity },
        });
      }
    }

    // calculate additional discount amount based on the percent
    if (data?.additionalDiscountPercent) {
      const additionalDiscountAmount =
        (data?.additionalDiscountPercent * data?.totalAmount) / 100;
      data.additionalDiscountAmount = additionalDiscountAmount;
    }

    const salesInvoice = await SalesInvoice.create({
      partyId: party?._id,
      businessId: req.params?.id,
      clientId: req.user?.id,
      status:
        data?.receivedAmount > 0
          ? "partially paid"
          : data?.receivedAmount === data?.totalAmount
          ? "paid"
          : "unpaid",
      type: "sales invoice",
      pendingAmount: data?.totalAmount - data?.receivedAmount,
      settledAmount: data?.receivedAmount,
      balanceAmount: data?.totalAmount - data?.receivedAmount,
      salesInvoiceNumber: existingInvoice
        ? existingInvoice.salesInvoiceNumber + 1
        : data?.salesInvoiceNumber,
      ...data,
    });

    party.currentBalance =
      (party.currentBalance || 0) + salesInvoice.balanceAmount;
    // party.totalSales = (party.totalSales || 0) + salesInvoice.balanceAmount;
    party.totalDebits = (party.totalDebits || 0) + salesInvoice.balanceAmount;
    party.totalInvoices =
      (party.totalInvoices || 0) + salesInvoice.balanceAmount;
    party.totalCredits = (party.totalCredits || 0) - salesInvoice.balanceAmount;
    await party.save();

    if (!salesInvoice) {
      return res
        .status(400)
        .json({ success: false, msg: "Sales invoice could not be created" });
    }

    return res.status(201).json({
      success: true,
      msg: "Invoice created successfully",
      salesInvoice,
    });
  } catch (error) {
    console.log("ERROR IN CREATING SALES INVOICE ");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

// CONTROLLER TO GET ALL THE SALES INVOICES
export async function getAllInvoices(req, res) {
  try {
    const businessId = req.params?.id;
    if (!businessId) {
      return res.status(400).json({
        success: false,
        msg: "Business ID is required",
      });
    }

    const invoices = await SalesInvoice.find({
      businessId: new mongoose.Types.ObjectId(businessId),
      clientId: req.user?.id,
    })
      .sort({ salesInvoiceDate: -1 })
      .populate("partyId");

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "Invoices not found",
        invoices: [],
        totalInvoices: 0,
        latestInvoiceNumber: 0,
        totalSales: 0,
        totalPaid: 0,
        totalUnpaid: 0,
      });
    }

    const latestInvoice = await SalesInvoice.findOne({
      businessId: req.params.id,
      clientId: req.user?.id,
    })
      .sort({ salesInvoiceNumber: -1 })
      .limit(1);

    // CALCULATE THE TOTALS OF ONLY THOSE INVOICES WHICH ARE NOT CANCELLED.
    const validInvoices =
      invoices?.filter(
        (invoice) => invoice?.status?.toLowerCase() !== "cancelled"
      ) || [];

    const { start, end } = getFinancialYearRange();

    const invoicesInFY = validInvoices.filter((invoice) => {
      const validDate = new Date(invoice?.salesInvoiceDate);
      return validDate >= start && validDate <= end;
    });

    const totalSales = Number(
      invoicesInFY
        .reduce((acc, invoice) => acc + Number(invoice?.totalAmount || 0), 0)
        .toFixed(2)
    ).toLocaleString("en-IN");

    const totalPaid = Number(
      invoicesInFY.reduce(
        (sum, invoice) => sum + (invoice.settledAmount || 0),
        0
      )
    ).toLocaleString("en-IN");

    const totalUnpaid = Number(
      invoicesInFY.reduce(
        (sum, invoice) =>
          sum + (invoice.totalAmount - (invoice.settledAmount || 0)),
        0
      )
    ).toLocaleString("en-IN");

    return res.status(200).json({
      success: true,
      invoices,
      totalInvoices: invoices.length,
      latestInvoiceNumber: latestInvoice?.salesInvoiceNumber || 0,
      totalSales,
      totalPaid,
      totalUnpaid,
    });
  } catch (error) {
    console.error("❌ ERROR IN GETTING SALES INVOICE:", error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

// CONTROLLER TO DELETE INVOICE (MARK STATUS AS CANCELLED AND INCREMENT THE STOCK OF THAT ITEM)

export async function deleteInvoice(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let { id } = req.params;
    const userId = req.user?.id;
    if (!id) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, msg: "Please provide invoice id" });
    }

    // Convert id into mongoose ObjectId
    id = new mongoose.Types.ObjectId(id);

    // Fetch invoice with party populated
    const invoice = await SalesInvoice.findById(id)
      .populate("partyId")
      .session(session);
    if (!invoice) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, msg: "Invoice not found" });
    }

    if (invoice.status === "cancelled") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, msg: "Invoice is already cancelled" });
    }

    const party = invoice.partyId;
    if (!party) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, msg: "Linked party not found" });
    }

    const reversalAmount = invoice.balanceAmount || 0;

    // Cancel invoice
    invoice.status = "cancelled";
    invoice.cancelledAt = new Date();
    invoice.cancelledBy = userId || null;
    invoice.pendingAmount = 0;
    invoice.settledAmount = 0;

    // Increment stock for items in invoice (skip deleted items)
    if (Array.isArray(invoice.items)) {
      for (const soldItem of invoice.items) {
        if (soldItem.itemType === "product") {
          const item = await Item.findById(soldItem?._id).session(session);
          if (!item) {
            // console.warn(`Item not found ${soldItem?.itemName}`);
            continue;
          }
          await Item.updateOne(
            { _id: soldItem._id },
            { $inc: { currentStock: soldItem?.quantity ?? 0 } }
          ).session(session);
        }
      }
    }

    // Update party balances
    party.currentBalance = (party.currentBalance || 0) - reversalAmount;
    party.totalDebits = (party.totalDebits || 0) - reversalAmount;
    party.totalInvoices = (party.totalInvoices || 0) - reversalAmount;
    party.totalCredits = (party.totalCredits || 0) + reversalAmount;

    // Save changes inside transaction
    await party.save({ session });
    await invoice.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      msg: "Invoice cancelled successfully",
      invoice,
    });
  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    session.endSession();
    console.error("ERROR IN CANCELLING SALES INVOICE", error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

// CONTROLLER TO GET A SINGLE INVOICE BY ID
export async function getInvoiceById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide a valid invoice id" });
    }

    let invoice = await SalesInvoice.findById(id)
      .populate("partyId")
      .populate("items.itemId");

    if (!invoice) {
      return res.status(404).json({ success: false, msg: "Invoice not found" });
    }

    invoice = invoice.toObject();

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("ERROR IN GETTING SALE INVOICE:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

// CONTROLLER TO UPDATE A SALES INVOICE
export async function updatedSalesInvoice(req, res) {
  try {
    const data = req.body;
    const invoiceId = req.params.id;
    if (!invoiceId) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide a valid invoice id" });
    }
    const invoice = await SalesInvoice.findByIdAndUpdate(invoiceId, data, {
      new: true,
    });
    if (!invoice) {
      return res.status(404).json({ success: false, msg: "Invoice not found" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Invoice updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// CONRTOLLER TO BULK UPLOAD SALES INVOICES
export async function bulkUploadSalesInvoices(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const businessId = req.params?.businessId;
    if (!businessId) {
      return res
        .status(400)
        .json({ success: false, msg: "Business id is required" });
    }

    const bulkInvoices = req.body || [];
    if (!Array.isArray(bulkInvoices) || bulkInvoices.length === 0) {
      return res
        .status(400)
        .json({ success: false, msg: "No invoices provided" });
    }
    const invoicesToInsert = [];
    let duplicateCount = 0;

    for (const invoiceData of bulkInvoices) {
      const existingInvoice = await SalesInvoice.findOne(
        {
          salesInvoiceNumber: invoiceData?.InvoiceNo,
          businessId,
        },
        null,
        { session }
      );
      if (existingInvoice) {
        duplicateCount++;
        continue;
      }

      const items = await Item.find(
        {
          invoiceNo: invoiceData?.InvoiceNo,
          businessId,
        },
        null,
        { session }
      );

      const party = await Party.findOne(
        { partyName: invoiceData?.PartyName, businessId },
        null,
        { session }
      );

      console.log(invoice);

      const newInovice = {
        businessId,
        clientId: req.user?.id,
        salesInvoiceDate: parseDate(invoiceData?.Date),
        salesInvoiceNumber: Number(invoiceData?.InvoiceNo),
        partyName: invoiceData?.PartyName,
        type: "sales invoice",
        items,
        partyId: party?._id || null,
        totalAmount: invoiceData?.TotalAmount || 0,
        balanceAmount: invoiceData?.BalanceDue || invoiceData?.TotalAmount || 0,
        pendingAmount: invoiceData?.TotalAmount || 0,
        amountSubTotal: invoiceData?.TotalAmount || 0,
      };
      invoicesToInsert.push(newInovice);
    }

    // BULK INSERT THE INVOICES
    let inserted = [];
    if (invoicesToInsert.length > 0) {
      inserted = await SalesInvoice.insertMany(invoicesToInsert, {
        session,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      msg: "Inserted successfully",
      insertedCount: invoicesToInsert.length,
      duplicateCount,
      inserted,
    });
  } catch (error) {
    console.log("ERROR IN BULK UPLOADING SALES INVOICES", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// CONTROLLER TO GET INVOICES OF A PARTY
export async function getAllInvoicesForAParty(req, res) {
  try {
    const businessId = req.query?.businessId;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ msg: "Please provide a valid party id" });
    }
    const invoices = await SalesInvoice.find({ partyId: id, businessId });
    return res.status(200).json({ success: true, invoices });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

// CONTROLLER TO GET SALES DATA FOR CHART
export async function getSalesDataForChart(req, res) {
  try {
    const businessId = req.params?.id;
    const days = parseInt(req.query?.days) || 15;
    const clientId = req.user?.id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));

    const salesData = await SalesInvoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({ success: true, salesData });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// SEND INVOICE VIA EMAIL
export async function sendInvoiceViaEmail(req, res) {
  try {
    const { html, email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email" });
    }

    const finalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice</title>
          <style>
            @page { size: A4; margin: 10mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .invoice-container { width: 100%; max-width: 900px; margin: auto; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${html}
          </div>
        </body>
      </html>
    `;

    const file = { content: finalHtml };

    const pdfBuffer = await pdf.generatePdf(file, {
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await sendInvoiceByEmail(email, finalHtml, pdfBuffer);

    return res
      .status(200)
      .json({ success: true, msg: "Invoice sent successfully" });
  } catch (error) {
    console.error("Error in sending email:", error.message);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// WAIT FOR QR CODE
const waitForQrCode = () => {
  if (qrCodeString) return Promise.resolve(qrCodeString);

  return new Promise((resolve, reject) => {
    qrPromiseResolve = resolve;
    setTimeout(() => {
      reject(new Error("QR not generated in time"));
    }, 20000);
  });
};

// GENERATE QR CODE
export async function generateQrCode(req, res) {
  try {
    if (isReady) {
      return res.status(200).json({
        status: "connected",
        message: "WhatsApp is already connected",
      });
    }

    // Wait for QR code to be generated
    const qrData = await waitForQrCode();
    const qrBase64 = await qrcode.toDataURL(qrData);

    return res.status(200).json({
      status: "qr",
      qr: qrBase64,
    });
  } catch (error) {
    console.error("⚠️ Error generating QR:", error.message);
    return res.status(202).json({
      status: "waiting",
      message: "⌛ QR not yet ready. Please retry in a few seconds.",
    });
  }
}

// SEND INVOICE VIA WHATSAPP
export async function sendInvoiceViaWhatsapp(req, res) {
  try {
    const { phoneNumbers, html, businessName, partyName, invoiceAmount } =
      req.body;

    if (!isReady) {
      return res.status(400).json({ error: "WhatsApp not connected yet." });
    }

    if (!phoneNumbers || phoneNumbers.length === 0 || !html) {
      return res
        .status(400)
        .json({ error: "Missing phone numbers or invoice." });
    }

    const finalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice</title>
          <style>
            @page { size: A4; margin: 10mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .invoice-container { width: 100%; max-width: 900px; margin: auto; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${html}
          </div>
        </body>
      </html>
    `;

    const file = { content: finalHtml };

    const pdfBuffer = await pdf.generatePdf(file, {
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    const pdfBase64 = pdfBuffer.toString("base64");
    const media = new pkg.MessageMedia(
      "application/pdf",
      pdfBase64,
      "Invoice.pdf"
    );

    // sending invoice to all the phone numbers
    for (const number of phoneNumbers) {
      const formattedNumber = number.toString().replace(/\D/g, "");
      const chatId = `${formattedNumber}@c.us`;

      await client.sendMessage(
        chatId,
        `Hi *${partyName?.trim()},*

Here are the details of your _Sale Invoice_ from *${businessName?.trim()}*:

*Invoice Amount:* ₹${invoiceAmount}

Thank you for doing business with us.  
Please find your invoice attached below.`
      );
      await client.sendMessage(chatId, media);
    }

    res
      .status(200)
      .json({ success: true, message: "Invoice sent successfully!" });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
}

// get whatsapp status
export async function getWhatsappStatus(req, res) {
  try {
    if (isReady) {
      return res.json({
        status: "connected",
        message: " WhatsApp is connected and ready.",
      });
    } else {
      return res.json({
        status: "waiting",
        message: "⌛ Initializing WhatsApp client. Please wait...",
      });
    }
  } catch (err) {
    console.error("Error getting WhatsApp status:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// get whatsapp profile
export async function getWhatsappProfile(req, res) {
  try {
    const me = client.info;
    const jid = `${me.wid.user}@c.us`;

    let profilePic = null;
    try {
      profilePic = await client.getProfilePicUrl(jid);
    } catch (e) {
      profilePic = null;
    }

    let about = null;

    if (typeof client.getStatus === "function") {
      try {
        const st = await client.getStatus(jid);
        about = st?.status || st || null;
      } catch (e) {
        about = null;
      }
    }

    if (!about && typeof client.getContactById === "function") {
      try {
        const contact = await client.getContactById(jid);
        about =
          contact?.bio ||
          contact?.about ||
          (contact?.profile && contact.profile.about) ||
          null;
      } catch (e) {
        about = null;
      }
    }

    if (!about) {
      if (typeof client.getAbout === "function") {
        try {
          about = await client.getAbout(jid);
        } catch (e) {
          about = null;
        }
      }
    }

    return res.json({
      number: me.wid.user,
      name: me.pushname || null,
      about,
      profilePic,
      rawClientInfo: me,
    });
  } catch (error) {
    console.error("Error /api/my-profile:", error);
    return res.status(500).json({ error: "Failed to get profile info" });
  }
}

// remove connection
export async function removeConnection(req, res) {
  const SESSION_PATH = path.join(process.cwd(), ".wwebjs_auth");
  await client.logout();
  if (fs.existsSync(SESSION_PATH)) {
    fs.rmSync(SESSION_PATH, { recursive: true, force: true });
    console.log("🗑️ Deleted session folder:", SESSION_PATH);
  }
  client.initialize();
  res.json({
    success: true,
    message: "WhatsApp connection removed successfully.",
  });
  try {
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
