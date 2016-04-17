exports.getUid = function(Sessions, session_id, cob) {
  var i;
  var res;
  Sessions.find(function(err, sessions) {
    if (err) 
      return console.error(err);

    for (i = 0; i < sessions.length; ++i) {
      var session = sessions[i];
      if (session._id == session_id) {
      	res = session.u_id;
      	break;
      }
    }
    cob(res);
  });
}

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

exports.getLogin = function(Users, Sessions, name, email, img_url, cob) {
	// find sid by uid, if not exist, create a session
	function findSessionIdByUserId(uid) {
		Sessions.findOne({'u_id': uid}, function(err, session) {
			if (session == null) {
				Sessions.create({'u_id': uid}, function(err, new_session) {
					cob(new_session._id);
				});
			} else {
				cob(session._id);
			}
		});
	}

	// find uid by email, if not exist, create a user
	Users.findOne({'email': email}, '_id', function(err, user) {
		// if not exist, create a user
		if (user == null) {
			Users.create({
				'name': name,
				'email':email,
				'type': 0,
				'trees': [],
				'img_url': img_url
			}, function(err, new_user) {
				findSessionIdByUserId(new_user._id);
			});
		} else {
			findSessionIdByUserId(user._id);
		}
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
   	  data['img'] = tree['img_url'];
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
 	  	  if (data['type'] == type['_id']) {
 	  	  	data['type'] = type['name'];
 	  	  	var o2_rate = type['o2_rate'];
 	  	  	data.stats['oxygen'] = o2_rate;
 	  	  }
 	  	}
 	  }
 	  cob(res);
    });
  });
}

exports.getTreesForUser = function(Users, Trees, Types, user_id, cob) {
  var res = [];
  var i, j;
  Users.find(function(err, users) {
    if (err) 
      return console.error(err);
  
  	var tree_ids = [];
    for (i = 0; i < users.length; ++i) {
      var user = users[i];
      console.log(user._id);
      if (user._id == user_id) {
        tree_ids = user.trees;
        break;
      }
    }
    
    Trees.find(function(err, trees) {
      if (err) 
        return console.error(err);
  
      for (i = 0; i < trees.length; ++i) {
        var tree = trees[i];
        if (tree_ids.indexOf(tree._id) >= 0) {
          data = {};
   	      data['location'] = tree['location'];
   	      data['plant_time'] = tree['plant_time'];
   	      data['img'] = null;
   	      data['type'] = tree['type'];
   	      data['stats'] = {};
   	      res.push(data);
        }
      }
      
      Types.find(function(err, types) {
 	    if (err) 
 	      return console.error(err);
  
 	    for (i = 0; i < types.length; ++i) {
 	      var type = types[i];
 	      for (j = 0; j < res.length; ++j) {
 	    	data = res[j];
 	    	if (data['type'] == type['_id']) {
 	    	  data['type'] = type['name'];
 	    	  var o2_rate = type['o2_rate'];
 	    	  data.stats['oxygen'] = o2_rate;
 	    	}
 	      }
 	    }
 	    cob(res);
      });
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
    data['img'] = user['img_url'];
    cob(data);
  });
}

exports.plantTree = function(Trees, Users, req, user_id) {
  var location = {x:47.6247503,
                  y:-122.313126};
  var rangex = 0.01;
  var rangey = 0.01;
  location.x = randomIntFromInterval(location.x-rangex,location.x+rangex);
  location.y = randomIntFromInterval(location.y-rangey,location.y+rangey);
  var tree = {
  	location: location,
  	type: req.body.type,
  	plant_time: new Date().getTime(),
  	img_url: ""
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

function randomIntFromInterval(min,max)
{
    return (Math.random()*(max-min)+min).toFixed(6);
}