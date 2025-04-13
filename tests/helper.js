const mongoose = require('mongoose');
const UserModel = require('../src/models/user.model');
const { generateToken } = require('../src/utils/jwt');

const clearDb = async () => {
    const collections = Object.values(mongoose.connection.collections);
    const promises = collections.map((collection) => collection.deleteMany({}));
    await Promise.all(promises);
};

const createTestUser = async () => {
    const counter = Math.floor(Math.random()*1000);
    const userData = {
        username: `testuser${counter}`,
        password: `password`,
    }
    const user = await UserModel.create(userData);
    const token = generateToken({ id: user._id, username: user.username });
    return { user, token };
}

module.exports = {
    clearDb,
    createTestUser,
}