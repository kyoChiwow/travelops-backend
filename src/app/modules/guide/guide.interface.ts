import { Types } from "mongoose";

export enum IGuideApplicationStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export interface IGuideApplication {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    nidPhoto: string;
    division: Types.ObjectId;
    status: IGuideApplicationStatus;
    createdAt?: Date;
    updatedAt: Date;
}