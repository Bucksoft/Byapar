// import Party from "../models/party.model.js";
// import SalesInvoice from "../models/salesInvoiceSchema.js";

// export const updatePartyBalance = async (partyId) => {
//   try {
//     const party = await Party.findById(partyId);
//     if (!party) return;
//     const invoices = await SalesInvoice.aggregate([
//       { $match: { partyId } },
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } },
//     ]);

//     const payments = await Payment.aggregate([
//       { $match: { partyId } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     const returns = await Return.aggregate([
//       { $match: { partyId } },
//       { $group: { _id: null, total: { $sum: "$returnAmount" } } },
//     ]);

//     const totalInvoices = invoices[0]?.total || 0;
//     const totalPayments = payments[0]?.total || 0;
//     const totalReturns = returns[0]?.total || 0;

//     let balance = party.openingBalance;
//     if (party.openingBalanceStatus === "To Collect") {
//       balance += totalInvoices - totalPayments - totalReturns;
//     } else {
//       balance -= totalInvoices - totalPayments - totalReturns;
//     }
//     party.currentBalance = balance;
//     party.totalInvoices = totalInvoices;
//     party.totalPayments = totalPayments;
//     party.totalReturns = totalReturns;

//     await party.save();
//     return party;
//   } catch (err) {
//     console.error("Error updating party balance:", err.message);
//   }
// };
