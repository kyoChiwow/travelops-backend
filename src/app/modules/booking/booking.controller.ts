import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createBooking = catchAsync(async (req: Request, res: Response) => {

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Booking created successfully!",
        data: result,
    })
})

export const BookingControllers = {
    createBooking,
}