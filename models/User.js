import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  googleId: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  image: { type: String },
  tryOnImages: [{ type: String }],
  provider: {
    type: [String],
    default: ["email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  addresses: [{
    fullName: String,
    phone: String,
    street: String,
    apartment: String,
    city: String,
    state: String,
    zipCode: String,
    addressType: { type: String, default: "home" }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  emailVerified: { type: Date },
  dailyTryOnCount: { type: Number, default: 0 },
  lastTryOnDate: { type: Date }
}, {
  timestamps: true
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


if (process.env.NODE_ENV === "development") {
  delete mongoose.models.User;
}


const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
