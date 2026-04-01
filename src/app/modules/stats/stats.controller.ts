import httpStatus from 'http-status-codes';
import { sendResponse } from "../../utils/sendResponse"
import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { StatsServices } from './stats.service';

const getBookingStats = catchAsync( async (req: Request, res: Response) => {

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking stats retrieved successfully!",
        data: {},
    })
} )

const getTourStats = catchAsync( async (req: Request, res: Response) => {
    const result = await StatsServices.getTourStatsService();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour stats retrieved successfully!",
        data: result,
    })
} )

const getUserStats = catchAsync( async (req: Request, res: Response) => {
    const result = await StatsServices.getUserStatsService();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User stats retrieved successfully!",
        data: result,
    })
} )

const getPaymentStats = catchAsync( async (req: Request, res: Response) => {

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment stats retrieved successfully!",
        data: {},
    })
} )

export const StatsControllers = {
    getBookingStats,
    getTourStats,
    getUserStats,
    getPaymentStats
}