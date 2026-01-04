import mongoose, { Document, Schema } from "mongoose";

export interface IListing extends Document {
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
  images: string[];
  category: "beach" | "mountain" | "city" | "luxury" | "trending";
  rating?: number;
  reviews?: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  amenities: string[];
  host: {
    name: string;
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    images: [String],
    category: {
      type: String,
      enum: ["beach", "mountain", "city", "luxury", "trending"],
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 1,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 1,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    amenities: [String],
    host: {
      name: {
        type: String,
        required: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IListing>("Listing", listingSchema);
