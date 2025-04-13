const  config  = require('../src/utils/config');
const mongoose = require('mongoose');
const { clearDb } = require('./helper');


// lifecycle function (hook) to run before all tests
beforeAll(async () => {
    //connect to db
    await mongoose.connect(config.DB_CONNECTION_STRING);
})

beforeEach( async () => {
    //clear db -> for every time test it will clear all datas but collections remian -> helper.js
    await clearDb();

})

afterAll( async () => {
    //close db connection
    await mongoose.connection.close();
})