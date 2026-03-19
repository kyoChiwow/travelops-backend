import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { BookingServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const booking = await BookingServices.createBookingService(req.body, decodedToken.userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Booking created successfully!",
        data: booking,
    })
})

const getUserBookings = catchAsync( async (req: Request, res: Response) => {
    const bookings = await BookingServices.getUserBookingService();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bookings retrieved successfully!",
        data: bookings,
    })
})

const getSingleBooking = catchAsync( async (req: Request, res: Response) => {
    const booking = await BookingServices.getBookingByIdService();    

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking retrieved successfully!",
        data: booking,
    })
})

const getAllBookings = catchAsync( async (req: Request, res: Response) => {
    const bookings = await BookingServices.getAllBookingService();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bookings retrieved successfully!",
        data: bookings,
    })
})

const updateBookingStatus = catchAsync( async (req: Request, res: Response) => {
    const updated = await BookingServices.updateBookingStatusService();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking status updated successfully!",
        data: updated,
    })
})

export const BookingControllers = {
    createBooking,
    getUserBookings,
    getSingleBooking,
    getAllBookings,
    updateBookingStatus
}