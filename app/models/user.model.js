var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "nama panjang tidak ada"],
  },
  email: {
    type: String,
    unique: [true, "email sudah pernah terdaftar"],
    lowercase: true,
    trim: true,
    required: [true, "email tidak sesuai"],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "{VALUE} is not a valid email!",
    },
  },
  role: {
    type: String,
    enum: ["member", "admin"],
    required: [true, "Pilih jenis user anda"],
  },
  password: {
    type: String,
    require: true,
  },
  created:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
