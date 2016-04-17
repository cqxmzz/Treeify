exports.getTopUsers = function(Users, cob) {
	function desc(u1, u2){
		return u2.trees.length - u1.trees.length;
	}
	Users.find({ 'type': 0, 'trees': { $ne: [] }}, 'name trees', function (err, users) {
		console.log("Top individuals:");

		indiv_desc = users.sort(desc);
		var top_indiv = [];
		for (var i = 0; i < 5 && i < indiv_desc.length; i++) {
			var user = indiv_desc[i];
			top_indiv.push({'name': user.name, 'num_trees': user.trees.length});
			console.log(user);
		}

		Users.find({ 'type': 1, 'trees': { $ne: [] }}, 'name trees', function (err, users) {
			console.log("Top companies:");

			comp_desc = users.sort(desc);
			var top_comp = [];
			for (var i = 0; i < 5 && i < comp_desc.length; i++) {
				var user = comp_desc[i];
				top_comp.push({'name': user.name, 'num_trees': user.trees.length});
				console.log(user);
			}

			cob({'individuals': top_indiv, 'companies': top_comp});
		});
	});
}

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

exports.getTypes = function(Types, cob) {
  var res = [];
  var i;
  Types.find(function(err, types) {
    if (err) 
      return console.error(err);

    for (i = 0; i < types.length; ++i) {
      var type = types[i];
      data = {};
      data['name'] = type['name'];
      data['02_rate'] = type['02_rate'];
      data['growth_rate'] = type['growth_rate'];
      data['life_span'] = type['life_span'];
      res.push(data);
    }
    cob(res);
  });
}

exports.getProfile = function(Users, user_id, cob) {
  Users.findById(user_id, function(err, user) {
    if (err) 
      return console.error(err);
    data = {};
    data['name'] = user['name'];
    data['img'] = "";
    cob(data);
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