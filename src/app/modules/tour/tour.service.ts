import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ITourType } from "./tour.interface";
import { TourType } from "./tour.model";

const createTourTypeService = async (payload: Partial<ITourType>) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour type already exists!");
  }

  const createTourType = await TourType.create(payload);

  return createTourType;
};

const getAllTourTypesService = async () => {
  const tourTypes = await TourType.find({});

  const totalTourTypes = await TourType.countDocuments();

  return {
    data: tourTypes,
    meta: {
      total: totalTourTypes,
    },
  };
};

const updateTourTypeService = async (
  id: string,
  payload: Partial<ITourType>,
) => {
  const isTourTypeExist = await TourType.findById(id);

  if (!isTourTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour type does not exist!");
  }

  const newUpdatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedTourType;
};

const deleteTourTypeService = async (id: string) => {
  const isTourTypeExist = await TourType.findById(id);

  if (!isTourTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour type does not exist!");
  }

  const result = await TourType.findByIdAndDelete(id);

  return result;
};

export const TourServices = {
  createTourTypeService,
  getAllTourTypesService,
  updateTourTypeService,
  deleteTourTypeService,
};
