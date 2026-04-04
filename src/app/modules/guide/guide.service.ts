/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IGuideApplicationStatus } from "./guide.interface";
import { GuideApplication } from "./guide.model";
import { Types } from "mongoose";
import { QueryBuilder } from "../../utils/queryBuilder";

const applyForGuideService = async (
  userId: string,
  divisionId: string,
  nidPhotoUrl: string,
) => {
  // 1. Check if application already exists
  const existingApp = await GuideApplication.findOne({ user: userId });
  if (existingApp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Application already exists!");
  }

  const application = await GuideApplication.create({
    user: userId,
    division: divisionId,
    nidPhoto: nidPhotoUrl,
    status: IGuideApplicationStatus.PENDING,
  });

  return application;
};

const approveRejectApplicationService = async (
  applicationId: string,
  status: IGuideApplicationStatus,
  adminUserId: string,
) => {
  const session = await GuideApplication.startSession();
  session.startTransaction();

  try {
    const application = await GuideApplication.findById(applicationId);
    if (!application) {
      throw new AppError(httpStatus.NOT_FOUND, "Application not found!");
    }

    if (application.status !== IGuideApplicationStatus.PENDING) {
      throw new AppError(httpStatus.BAD_REQUEST, "Application is not pending!");
    }

    application.status = status;
    application.reviewedBy = new Types.ObjectId(adminUserId);
    application.reviewedAt = new Date();

    await application.save({ session });

    // Change the role in user if approved
    if (status === IGuideApplicationStatus.APPROVED) {
      const user = await User.findById(application.user);
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!");
      }

      if (user.role === Role.USER) {
        user.role = Role.GUIDE;
        await user.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    const updatedApplication = await GuideApplication.findById(applicationId)
      .populate("user", "name email picture")
      .populate("division", "name")
      .populate("reviewedBy", "name email");

    return updatedApplication;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getAllGuideApplicationService = async (query: Record<string, string>) => {
  const searchableFields = [ "status" ];
  const baseQuery = GuideApplication.find()
    .populate("user","name email picture")
    .populate("division","name")
    .populate("reviewedBy","name email");
  const queryBuilder = new QueryBuilder(baseQuery, query);

  const applications = await queryBuilder
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    applications.build(),
    applications.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleApplicationService = async (id: string) => {
  const application = await GuideApplication.findById(id)
    .populate("user", "name email picture")
    .populate("division", "name")
    .populate("reviewedBy", "name email");

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, "Application not found!");
  }

  return application;
}

const archiveApplicationService = async (id: string) => {
  const application = await GuideApplication.findById(id);

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, "Application not found!");
  }

  if (application.status === IGuideApplicationStatus.ARCHIVED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Application already archived!");
  }

  application.status = IGuideApplicationStatus.ARCHIVED;
  await application.save();

  return application;
}

export const GuideServices = {
  applyForGuideService,
  getAllGuideApplicationService,
  approveRejectApplicationService,
  getSingleApplicationService,
  archiveApplicationService
};
