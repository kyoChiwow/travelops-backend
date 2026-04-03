import { model, Schema } from "mongoose";
import { IGuideApplication, IGuideApplicationStatus } from "./guide.interface";

const guideApplicationSchema = new Schema<IGuideApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    nidPhoto: { type: String, required: true },
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    status: {
      type: String,
      enum: Object.values(IGuideApplicationStatus),
      default: IGuideApplicationStatus.PENDING,
    },
  },
  { timestamps: true, versionKey: false },
);

export const GuideApplication = model<IGuideApplication>("GuideApplication", guideApplicationSchema);
