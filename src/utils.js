define([
	"./jc",
	"./utils/blocks",
	"./utils/cache",
	"./utils/cookies",
	"./utils/domx",
	"./utils/envs",
	"./utils/http",
	"./utils/localStorage",
	"./utils/logs",
	"./utils/query"
],function(jc,blocks,cache,cookies,domx,envs,http,localStorage,logs,query){
	
	return jc.utils = {
		blocks : blocks,
		cache : cache,
		cookies : cookies,
		domx : domx,
		envs : envs,
		http : http,
		localStorage : localStorage,
		logs : logs,
		query : query
	};
})