define([
	"./jc",
	"./utils/blocks",
	"./utils/storage",
	"./utils/cookies",
	"./utils/domx",
	"./utils/envs",
	"./utils/http",
	"./utils/localStorage",
	"./utils/logs",
	"./utils/query"
],function(jc,blocks,storage,cookies,domx,envs,http,localStorage,logs,query){
	
	return jc.utils = {
		blocks : blocks,
		storage : storage,
		cookies : cookies,
		domx : domx,
		envs : envs,
		http : http,
		localStorage : localStorage,
		logs : logs,
		query : query
	};
})