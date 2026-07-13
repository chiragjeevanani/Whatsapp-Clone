const User = require("../models/user");

class AuthRepository {
  async findByPhone(phoneNumber) {
    return User.findOne({ phoneNumber });
  }

  async createUser(phoneNumber) {
    return User.create({ phoneNumber });
  }

  async findById(id) {
    return User.findById(id);
  }
}

module.exports = new AuthRepository();
