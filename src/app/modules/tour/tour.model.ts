import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: Schema.Types.ObjectId, ref: "TourType", required: true },
  },
  { timestamps: true },
);

tourSchema.pre("save", async function () {
  if (this.isModified("title")) {
    const baseSlug = this.title?.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    // Extra safety check
    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    // Extra safety check

    this.slug = slug;
  }
});

tourSchema.pre("findOneAndUpdate", async function () {
  const tour = this.getUpdate() as Partial<ITour>

  if (tour.title) {
    const baseSlug = tour.title?.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    // Extra safety check
    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    // Extra safety check

    tour.slug = slug;
  }

  this.setUpdate(tour);
})

export const TourType = model<ITourType>("TourType", tourTypeSchema);

export const Tour = model<ITour>("Tour", tourSchema);
