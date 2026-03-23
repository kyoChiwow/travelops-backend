/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { SSLServices } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslcommerz.interface";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createBookingService = async (
  payload: Partial<IBooking>,
  userId: string,
) => {
  const transactionId = getTransactionId();

  // Transaction Rollback Session
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please update your profile to book a tour!",
      );
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No tour cost found!");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour?.costFrom) * Number(payload.guestCount!);

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session },
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId,
          amount,
        },
      ],
      { session },
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    // SSLCommerz Codes here
    const userAddress = (updatedBooking?.user as any).address
    const userEmail = (updatedBooking?.user as any).email
    const userPhoneNumber = (updatedBooking?.user as any).phone
    const userName = (updatedBooking?.user as any).name

    const sslPayload: ISSLCommerz = {
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      name: userName,
      amount: amount,
      transactionId: transactionId
    }

    const sslPayment = await SSLServices.sslPaymentInit(sslPayload);

    console.log(sslPayment);
    // SSLCommerz Codes here

    await session.commitTransaction();
    session.endSession();
    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
  // Transaction Rollback Session
};

const getAllBookingService = async () => {
  return {};
};

const getUserBookingService = async () => {
  return {};
};

const getBookingByIdService = async () => {
  return {};
};

const updateBookingStatusService = async () => {
  return {};
};

export const BookingServices = {
  createBookingService,
  getAllBookingService,
  getBookingByIdService,
  getUserBookingService,
  updateBookingStatusService,
};
