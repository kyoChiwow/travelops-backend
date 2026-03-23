import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const successPaymentService = async (query: Record<string, string>) => {
  /**
   * Update Payment status to PAID
   * Update Booking status to CONFIRM
   * Also use transaction rollback as there are two different collection that needs to be updated
   */

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      {
        status: PAYMENT_STATUS.PAID,
      },
      { new: true, runValidators: true, session },
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { runValidators: true, session },
    )

    await session.commitTransaction();
    session.endSession();

    return {
        success: true,
        message: "Payment completed successfully!"
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPaymentService = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      {
        status: PAYMENT_STATUS.FAILED,
      },
      { new: true, runValidators: true, session },
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session },
    )

    await session.commitTransaction();
    session.endSession();

    return {
        success: false,
        message: "Payment Failed!"
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPaymentService = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { new: true, runValidators: true, session },
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCELLED },
      { runValidators: true, session },
    )

    await session.commitTransaction();
    session.endSession();

    return {
        success: false,
        message: "Payment Cancelled!"
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentServices = {
  successPaymentService,
  failPaymentService,
  cancelPaymentService,
};
