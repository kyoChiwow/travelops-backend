import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createTourType = catchAsync( async (req: Request, res: Response) => {
    const result = await TourServices.createTourTypeService(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tour type created successfully!",
        data: result,
    })
})

const getAllTourTypes = catchAsync( async (req: Request, res: Response) => {
    const result = await TourServices.getAllTourTypesService();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour types retrieved successfully!",
        data: result,
    })
})

const updateTourType = catchAsync( async (req: Request, res: Response) => {
    const tourTypeId = req.params.id;

    const result = await TourServices.updateTourTypeService(tourTypeId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour type updated successfully!",
        data: result,
    })
})

const deleteTourType = catchAsync( async (req: Request, res: Response) => {
    const tourTypeId = req.params.id;

    const result = await TourServices.deleteTourTypeService(tourTypeId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour type deleted successfully!",
        data: result,
    })
})

const createTour = catchAsync( async (req: Request, res: Response) => {
    const result = await TourServices.createTourService(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tour created successfully!",
        data: result,
    })
} )

const getTours = catchAsync( async (req: Request, res: Response) => {
    const query = req.query;
    const result = await TourServices.getToursService(query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tours retrieved successfully!",
        data: result,
    })
} )

const updateTour = catchAsync( async (req: Request, res: Response) => {
    const tourId = req.params.id;

    const result = await TourServices.updateTourService(tourId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour updated successfully!",
        data: result,
    })
} )

const deleteTour = catchAsync( async (req: Request, res: Response) => {
    const tourId = req.params.id;

    const result = await TourServices.deleteTourService(tourId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour deleted successfully!",
        data: result,
    })
} )

export const TourControllers = {
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType,
    createTour,
    getTours,
    updateTour,
    deleteTour
}