/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/appError";

export interface IInvoiceData {
    transactionId: string;
    bookindDate: Date;
    userName: string;
    tourTitle: string;
    guestCount: number;
    totalAmount: number;
}

export const generatePdf = async (invoiceData: IInvoiceData) => {
    try {
        return new Promise((resolve, reject) => {
            const doc= new PDFDocument({size: "A4", margin: 50});
            const buffer: Uint8Array[] = [];

            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));

            // PDF Content
            doc.fontSize(20).text("Invoice", {align: "center"});
            doc.moveDown();
            doc.fontSize(14).text(`Transaction Id: ${invoiceData.transactionId}`);
            doc.text(`Booking Date: ${invoiceData.bookindDate}`);
            doc.text(`Customer Name: ${invoiceData.userName}`);

            doc.moveDown();

            doc.text(`Tour: ${invoiceData.tourTitle }`)
            doc.text(`Guests: ${invoiceData.guestCount }`)
            doc.text(`Total Amount: ${invoiceData.totalAmount.toFixed(2) }`)

            doc.moveDown();

            doc.text("Thank you for booking with us!", { align: "center" });

            doc.end();

        })
    } catch (error: any) {
        console.log(error);
        throw new AppError(401, `PDF creation failed! ${error.message}`)
    }
}