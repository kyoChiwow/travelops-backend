import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

const createBookingService = async (
  payload: Partial<IBooking>,
  userId: string,
) => {
  const transactionId = getTransactionId();
  const user = await User.findById(userId);


  if (!user?.phone || !user?.address) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please update your profile to book a tour!",
    );
  }

  const tour = await Tour.findById(payload.tour).select("costFrom");

  if(!tour?.costFrom) {
    throw new AppError(httpStatus.BAD_REQUEST, "No tour cost found!");
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const amount = Number(tour?.costFrom) * Number(payload.guestCount!);

  const booking = await Booking.create({
    user: userId,
    status: BOOKING_STATUS.PENDING,
    ...payload,
  });

  const payment = await Payment.create({
    booking : booking._id,
    status: PAYMENT_STATUS.UNPAID,
    transactionId,
    amount,
  })

  const updatedBooking = await Booking.findByIdAndUpdate(booking._id, { payment: payment._id }, { new: true, runValidators: true });

  return updatedBooking;
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
