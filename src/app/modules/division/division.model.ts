import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  { timestamps: true },
);

divisionSchema.pre("save", async function () {
  if (this.isModified("name")) {
    const baseSlug = this.name?.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    // Extra safety check
    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-division-${counter++}`;
    }
    // Extra safety check

    this.slug = slug;
  }
});

divisionSchema.pre("findOneAndUpdate", async function () {
  const division = this.getUpdate() as Partial<IDivision>

  if (division.name) {
    const baseSlug = division.name?.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    // Extra safety check
    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    // Extra safety check

    division.slug = slug;
  }

  this.setUpdate(division);
})

export const Division = model<IDivision>("Division", divisionSchema);
