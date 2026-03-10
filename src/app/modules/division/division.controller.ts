import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createDivision = catchAsync(async (req: Request, res: Response) => {
    const result = await DivisionService.createDivisionService(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Division created successfully!",
        data: result,
    })
})

const getDivisions = catchAsync( async (req: Request, res: Response) => {
    const result = await DivisionService.getDivisionsService();

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
    deleteDivison
}