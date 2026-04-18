import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ITour } from "./tour.interface";
import { TourServices } from "./tour.service";

// ------------> Tour Types <------------ //
const createTourType = catchAsync(async (req: Request, res: Response) => {
  const result = await TourServices.createTourTypeService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tour type created successfully!",
    data: result,
  });
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourServices.getAllTourTypesService(
    query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour types retrieved successfully!",
    data: result,
  });
});

const getSingleTourType = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const result = await TourServices.getSingleTourTypeService(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour type retrieved successfully!",
    data: result,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const tourTypeId = req.params.id;

  const result = await TourServices.updateTourTypeService(tourTypeId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour type updated successfully!",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const tourTypeId = req.params.id;

  const result = await TourServices.deleteTourTypeService(tourTypeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour type deleted successfully!",
    data: result,
  });
});

// ------------> Tour Types <------------ //

// ------------> Tours <------------ //
const createTour = catchAsync(async (req: Request, res: Response) => {
  const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[])?.map((file) => file.path),
  };
  const result = await TourServices.createTourService(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tour created successfully!",
    data: result,
  });
});

const getTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourServices.getToursService(
    query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tours retrieved successfully!",
    data: result,
  });
});

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const result = await TourServices.getSingleTourService(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour retrieved successfully!",
    data: result,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const tourId = req.params.id;
  const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[])?.map((file) => file.path),
  };

  const result = await TourServices.updateTourService(tourId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour updated successfully!",
    data: result,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const tourId = req.params.id;

  const result = await TourServices.deleteTourService(tourId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour deleted successfully!",
    data: result,
  });
});
// ------------> Tours <------------ //

export const TourControllers = {
  createTourType,
  getAllTourTypes,
  getSingleTourType,
  updateTourType,
  deleteTourType,
  createTour,
  getTours,
  getSingleTour,
  updateTour,
  deleteTour,
};
