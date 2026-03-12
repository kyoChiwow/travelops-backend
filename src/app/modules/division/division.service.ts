import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import { QueryBuilder } from "../../utils/queryBuilder";
import { divisionSearchableFields } from "./division.constant";

const createDivisionService = async (payload: IDivision) => {

    const existingDivision = await Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new Error("A division with this name already exists.");
    }

    const division = await Division.create(payload);

    return division
};

const getDivisionsService = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Division.find(), query)
  const divisions = await queryBuilder
    .filter()
    .search(divisionSearchableFields)
    .sort()
    .fields()
    .paginate()

  const [data, meta] = await Promise.all([
    divisions.build(),
    divisions.getMeta(),
  ])

  return {
    data,
    meta
  }
};

const getSingleDivisionService = async (slug: string) => {
  const division = await Division.findOne({ slug });

  return {
    data: division,
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
  getSingleDivisionService
};
