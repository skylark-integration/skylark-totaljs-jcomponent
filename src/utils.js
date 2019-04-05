define([
	"./jc",
	"./utils/blocks",
	"./utils/cache",
	"./utils/cookies",
	"./utils/domx",
	"./utils/env",
	"./utils/http",
	"./utils/localStorage",
	"./utils/logs",
	"./utils/query"
],function(jc,blocks,cache,cookies,domx,env,http,localStorage,logs,query){
	
	return jc.utils = {
		blocks : blocks,
		cache : cache,
		cookies : cookies,
		domx : domx,
		env : env,
		http : http,
		localStorage : localStorage,
		logs : logs,
		query : query
	};
})