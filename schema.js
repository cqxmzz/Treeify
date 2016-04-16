module.exports = function(mongoose) {
    var sessionsSchema = mongoose.Schema({
        _id: String,
        u_id: String
    });

    var treesSchema = mongoose.Schema({
        _id: String,
        type: String,
        location: {
    		x: Number,
    		y: Number
        },
        plant_time: Number
    });

    var typesSchema = mongoose.Schema({
        _id: String,
        name: String,
        o2rate: Number,
        growth_rate: Number,
        life_span: Number
    });

    var usersSchema = mongoose.Schema({
        _id: String,
        name: String,
        email: String,
        type: Number,
        trees: [String]
    });

    var Users = mongoose.model('Users', treesSchema);
    Users.find(function (err, users) {
      if (err) return console.error(err);
      console.log(users);
    })
}