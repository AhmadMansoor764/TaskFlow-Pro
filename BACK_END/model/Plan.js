import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },

    days: [
      {
        dayNumber: Number,
        task: String,
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    progress: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "active",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
  },
  { timestamps: true },
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
