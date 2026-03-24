var req_headers = [];

var names = String(context.getVariable('request.headers.names')).slice(1,-1).split(',').map(function(s) { return s.trim(); });
names.forEach(function(name) {
	req_headers.push({
		"name": name, 
		"value": context.getVariable('request.header.' + name)
	});
});

context.setVariable("req_headers", JSON.stringify(JSON.stringify(req_headers)));