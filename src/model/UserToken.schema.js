import mongoose from "mongoose";

const userTokenSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    refreshtoken: {
      type: String,
      Required: [true, "Token is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserToken", userTokenSchema);
