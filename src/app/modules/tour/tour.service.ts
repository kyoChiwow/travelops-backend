import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

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

const createTourService = async (payload: Partial<ITour>) => {
  console.log(payload)
  const existingTour = await Tour.findOne({ slug: payload.slug });

  if (existingTour) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour already exists!");
  }

  const baseSlug = payload.title?.toLocaleLowerCase().split(" ").join("-");
      let slug = `${baseSlug}-tour`;
  
      // Extra safety check
      let counter = 0
      while(await Tour.exists({ slug })) {
          slug = `${slug}-${counter++}`
      }
      // Extra safety check
  
      payload.slug = slug

  const createTour = await Tour.create(payload);

  return createTour;
}

const getToursService = async () => {
  const tours = await Tour.find({});

  const allTours = await Tour.countDocuments();

  return {
    data: tours,
    meta: {
      total: allTours
    }
  }
}

const updateTourService = async (id: string, payload: Partial<ITour>) => {
  const isTourExist = await Tour.findById(id);

  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour does not exist!");
  }

  if (payload.title) {
    const baseSlug = payload.title?.toLocaleLowerCase().split(" ").join("-");
      let slug = `${baseSlug}-tour`;
  
      // Extra safety check
      let counter = 0
      while(await Tour.exists({ slug })) {
          slug = `${slug}-${counter++}`
      }
      // Extra safety check
  
      payload.slug = slug
  }

  const newUpdatedTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedTour;
}

const deleteTourService = async (id: string) => {
  const isTourExist = await Tour.findById(id);

  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour does not exist!");
  }

  const result = await Tour.findByIdAndDelete(id);

  return result;
}

export const TourServices = {
  createTourTypeService,
  getAllTourTypesService,
  updateTourTypeService,
  deleteTourTypeService,
  createTourService,
  getToursService,
  updateTourService,
  deleteTourService
};
