'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// schema
const userSchema = new Schema({
  firstName: { type: String, trim: true, required: [true, 'Campo primeiro nome é obrigatório!'] },
  lastName: { type: String, trim: true, default: null },
  email: { type: String, required: [true, 'Campo e-mail é obrigatório!'], index: { unique: true } },
  password: { type: String, required: [true, 'Campo password é obrigatório!'], minlength: 6 },
  avatar: { type: String, trim: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// gerar o hash do password antes de salvar
userSchema.pre('save', function (next) {
  var user = this;

  // gerar o hash apenas se o password mudou ou para um novo usuário
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

// method to compare a given password with the database hash
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password).then(function (res) {
    return res;
  }).catch(function (err) {
    return err;
  });
};

module.exports = mongoose.model('User', userSchema);