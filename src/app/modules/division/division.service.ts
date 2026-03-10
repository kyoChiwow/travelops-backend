import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivisionService = async (payload: Partial<IDivision>) => {
  const existingDivision = await Division.findOne({ name: payload.name });

  if (existingDivision) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Division already exists!");
  }

  const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-");
  let slug = `${baseSlug}-division`;

  // Extra safety check
  let counter = 0;
  while (await Division.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }
  // Extra safety check

  payload.slug = slug;

  const division = await Division.create(payload);

  return division;
};

const getDivisionsService = async () => {
  const divisions = await Division.find({});

  const allDivisions = await Division.countDocuments();

  return {
    data: divisions,
    meta: {
      total: allDivisions,
    },
  };
};

const updateDivisionService = async (
  id: string,
  payload: Partial<IDivision>,
) => {
  const isDivisionExist = await Division.findById(id);

  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Division does not exist!");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Division already exists!");
  }

  if (payload.name) {
    const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    // Extra safety check
    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    // Extra safety check

    payload.slug = slug;
  }

  const newUpdatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedDivision;
};

const deleteDivisonService = async (id: string) => {
  const isDivisionExist = await Division.findById(id);

  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Division does not exist!");
  }

  await Division.findByIdAndDelete(id);
  return null;
};

export const DivisionService = {
  createDivisionService,
  getDivisionsService,
  updateDivisionService,
  deleteDivisonService,
};
