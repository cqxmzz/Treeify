exports.getTopUsers = function(Users, cob) {
	function desc(u1, u2){
		return u2.trees.length - u1.trees.length;
	}
	Users.find({ 'type': 0, 'trees': { $ne: [] }}, 'name trees', function (err, users) {
		console.log("got individuals:");
		console.log(users);
		indiv_desc = users.sort(desc);

		var top_indiv = [];
		for (var i = 0; i < 5 && i < indiv_desc.length; i++) {
			var user = indiv_desc[i];
			top_indiv.push({'name': user.name, 'num_trees': user.trees.length});
		}

		Users.find({ 'type': 1, 'trees': { $ne: [] }}, 'name trees', function (err, users) {
			console.log("got companies:");
			console.log(users);
			comp_desc = users.sort(desc);

			var top_comp = [];
			for (var i = 0; i < 5 && i < comp_desc.length; i++) {
				var user = comp_desc[i];
				top_comp.push({'name': user.name, 'num_trees': user.trees.length});
			}

			cob({'individuals': top_indiv, 'companies': top_comp});
		});
	});
}

exports.sayHelloInSpanish = function() {
  return "Hola";
};