import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { tourSearchableFields } from "./tour.constant";
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

const getSingleTourTypeService = async (slug: string) => {
  const tourType = await TourType.findOne({ slug })

  return {
    data: tourType,
  };
}

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
  const existingTour = await Tour.findOne({ slug: payload.slug });

  if (existingTour) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour already exists!");
  }

  const createTour = await Tour.create(payload);

  return createTour;
};

// const getToursServiceOld = async (query: Record<string, string>) => {

//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const fields = query.fields?.split(",").join(" ") || "";

//   for (const field of excludeField) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const searchQuery = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };

//   const tours = await Tour.find(searchQuery)
//     .find(filter)
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);

//   const allTours = await Tour.countDocuments();

//   const totalPage = Math.ceil(allTours / limit);
//   const meta = {
//     page: page,
//     limit: limit,
//     total: allTours,
//     totalPage: totalPage,
//   }

//   return {
//     data: tours,
//     meta: meta,
//   };
// };
const getToursService = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);
  const tours = await queryBuilder
    .filter()
    .search(tourSearchableFields)
    .sort()
    .fields()
    .paginate()

  const [data, meta] = await Promise.all([
    tours.build(),
    tours.getMeta(),
  ])

  return {
    data,
    meta,
  };
};

const getSingleTourService = async (slug: string) => {
  const tour = await Tour.findOne({ slug });

  return {
    data: tour,
  }
}

const updateTourService = async (id: string, payload: Partial<ITour>) => {
  const isTourExist = await Tour.findById(id);

  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour does not exist!");
  }

  const newUpdatedTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedTour;
};

const deleteTourService = async (id: string) => {
  const isTourExist = await Tour.findById(id);

  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour does not exist!");
  }

  const result = await Tour.findByIdAndDelete(id);

  return result;
};

export const TourServices = {
  createTourTypeService,
  getAllTourTypesService,
  getSingleTourTypeService,
  updateTourTypeService,
  deleteTourTypeService,
  createTourService,
  getToursService,
  getSingleTourService,
  updateTourService,
  deleteTourService,
};
