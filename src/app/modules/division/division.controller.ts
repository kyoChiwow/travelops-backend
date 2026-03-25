import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IDivision } from "./division.interface";

const createDivision = catchAsync(async (req: Request, res: Response) => {
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }
    const result = await DivisionService.createDivisionService(payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Division created successfully!",
        data: result,
    })
})

const getDivisions = catchAsync( async (req: Request, res: Response) => {
    const query = req.query;
    const result = await DivisionService.getDivisionsService(query as Record<string, string>)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Divisions retrieved successfully!",
        data: result.data,
        meta: result.meta
    })
})

const getSingleDivision = catchAsync( async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const result = await DivisionService.getSingleDivisionService(slug);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Divisions retrieved successfully!",
        data: result,
    })
})

const updateDivison = catchAsync( async (req: Request, res: Response) => {
    const divisionId = req.params.id;
    const payload = req.body;
    
    const result = await DivisionService.updateDivisionService(divisionId, payload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Division updated successfully!",
        data: result,
    })
})

const deleteDivison = catchAsync( async (req: Request, res: Response) => {
    const divisionId = req.params.id;

    const result = await DivisionService.deleteDivisonService(divisionId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Division deleted successfully!",
        data: result,
    })
})


export const DivisonControllers = {
    createDivision,
    getDivisions,
    updateDivison,
    deleteDivison,
    getSingleDivision
}