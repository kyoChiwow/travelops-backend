import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GuideServices } from "./guide.service";
import { JwtPayload } from "jsonwebtoken";

const applyForGuide = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { divisionId } = req.body;
  const file = req.file as Express.Multer.File;

  const result = await GuideServices.applyForGuideService(
    decodedToken.userId,
    divisionId,
    file.path,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "You applied for GUIDE successfully!",
    data: result,
  });
});

const approveRejectApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const admin = req.user as JwtPayload;

  const result = await GuideServices.approveRejectApplicationService(id, status, admin.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Application ${status.toLowerCase()} successfully!`,
    data: result,
  })
});

const getAllGuideApplications = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await GuideServices.getAllGuideApplicationService(query as Record<string, string>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guide applications retrieved successfully!",
    data: result,
  })
});

const getSingleApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GuideServices.getSingleApplicationService(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guide application retrieved successfully!",
    data: result,
  })
});

const archiveApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GuideServices.archiveApplicationService(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Guide application archived successfully!",
    data: result,
  })
});

export const GuideControllers = {
  applyForGuide,
  approveRejectApplication,
  getAllGuideApplications,
  getSingleApplication,
  archiveApplication
};
