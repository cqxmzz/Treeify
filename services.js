exports.sayHelloInEnglish = function() {
  return "HELLO";
};

exports.sayHelloInSpanish = function() {
  return "Hola";
};

exports.getTrees = function(Trees, Types, cob) {
  var res = [];
  var i, j;
  Trees.find(function(err, trees) {
    if (err) 
      return console.error(err);

    for (i = 0; i < trees.length; ++i) {
      var tree = trees[i];
   	  data = {};
   	  data['location'] = tree['location'];
   	  data['plant_time'] = tree['plant_time'];
   	  data['img'] = null;
   	  data['type'] = tree['type'];
   	  data['stats'] = {};
   	  res.push(data);
    }
    
    Types.find(function(err, types) {
 	  if (err) 
 	  	return console.error(err);

 	  for (i = 0; i < types.length; ++i) {
 	  	var type = types[i];
 	  	for (j = 0; j < res.length; ++j) {
 	  	  data = res[j];
 	  	  if (data['type'] === type['_id']) {
 	  	  	data['type'] = type['name'];
 	  	  	var o2_rate = type['o2_rate'];
 	  	  	data.stats['oxygen'] = o2_rate;
 	  	  	break;
 	  	  }
 	  	}
 	  }
 	  cob(res);
    });
  });
}

exports.plantTree = function(Trees, Users, req, user_id) {
  var tree = {
  	location: req.body.location,
  	type: req.body.type,
  	plant_time: new Date().getTime(),
  };
  Trees.create(tree, function(err, tree_saved) {
    if (err) 
      return console.error(err);

    Users.findById(user_id, function(err, user) {
      if (err)
      	return console.error(err);

      user.trees.push(tree_saved._id);
      user.save(function(err) {
      	if (err) 
      	  return console.error(err);
      });
    }); 
  });
}