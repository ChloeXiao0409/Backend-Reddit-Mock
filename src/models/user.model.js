const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

// Mongooose Validation: -> for simple schema validation
// Logic: it can be customized in the schema
// The validation duration will occur when the data is saved to the database
// e.g. UserModel.findByIdAndUpdate({}, {}, { runValidators: true });
// it will need a third argument to run the validators

// 1. Create a schema
const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, // mongoose create unique index in mongodb
        minLength: 2,
        maxLength: 20,
        validate: {
            validator: (username) => {
                //validation logic
                return /^[a-zA-Z0-9]+$/.test(username); // regex to check if username is alphanumeric
            },
            // When the validator fails, this message will be returned  
            message: (props) => `${props.value} is not a valid username`,
        }
    },
    password: {
        type: String,
        require: true,
        minLength: 6,
    }
});

// Encryption can be a function add to utils
// Can also be a part of user model
// Set password -> user.hashPassword() -> need THIS to point!!!
schema.methods.hashPassword = async function() {
    this.password = await bcrypt.hash(this.password, 12);
}
// Compare validation -> user.validatePassword() -> id return no await
schema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
}

// 2. Create a model and exports
// const UserModel = model("User", schema);
// module.exports = UserModel;
module.exports = model("User", schema);