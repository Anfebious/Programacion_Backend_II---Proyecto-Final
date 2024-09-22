import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import bcrypt from "bcrypt";

// Define the user schema
const userSchema = new Schema({
    first_name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    last_name: {
        type: String,
        required: [true, "El apellido es obligatorio"],
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        unique: true, // Email must be unique
    },
    age: {
        type: Number,
        required: [true, "La edad es obligatoria"],
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts", // Reference to the Cart model
    },
    role: {
        type: String,
        default: 'user', // Default role is 'user'
        enum: ['user', 'admin'], // Possible roles
    }
}, {
    timestamps: true, // Add timestamps for createdAt and updatedAt
    versionKey: false, // Remove the __v version key
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        // Hash the password with a salt round of 10
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

// Add pagination plugin
userSchema.plugin(paginate);

// Create and export the User model
const User = model("users", userSchema);

export default User;