const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function setup() {
 const calls = [];
 const http = Object.fromEntries(['get','put','post','patch','delete'].map(method => [method, async (...args) => {
  calls.push({method,args});
  return {data: method==='get' ? (args[0].endsWith('/settings') ? {url:'https://example.test/v1',modelName:'model',hasKey:true} : []) : {id:1}};
 }]));
 const exports = {};
 const source=ts.transpileModule(fs.readFileSync('src/apis/llm.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021,esModuleInterop:true}}).outputText;
 vm.runInNewContext(source,{exports,require:name=>{assert.equal(name,'./gateway-http');return {__esModule:true,default:http};}});
 return {api:exports.llmApi,calls};
}
test('loads all management resources through the authenticated gateway',async()=>{
 const {api,calls}=setup();const result=await api.load();
 assert.deepEqual(calls.map(call=>call.args[0]).sort(),['/admin/llm/agents','/admin/llm/settings','/admin/llm/skills']);
 assert.equal(result.settings.hasKey,true);assert.equal(result.agents.length,0);
});
test('blank replacement key is omitted and settings are normalized',async()=>{
 const {api,calls}=setup();await api.saveSettings({url:' https://example.test/v1 ',modelName:' model ',key:' '});
 assert.equal(calls[0].method,'put');
 assert.deepEqual(JSON.parse(JSON.stringify(calls[0].args[1])),{url:'https://example.test/v1',modelName:'model'});
});
test('agent create/edit excludes ownership and stale skill-form fields',async()=>{
 const {api,calls}=setup();const body={name:'Main agent',agent_id:'main',skill:4,userId:999,systemPrompt:'stale'};
 await api.save('agents',body);await api.save('agents',{name:'Main agent',agent_id:'main'},8);
 assert.equal(calls[0].method,'post');assert.equal(calls[1].method,'patch');assert.equal(calls[1].args[0],'/admin/llm/agents/8');
 assert.deepEqual(JSON.parse(JSON.stringify(calls[0].args[1])),{name:'Main agent',agent_id:'main',skill:4});
 assert.equal(calls[1].args[1].skill,null);
});
test('skill CRUD uses backend DTO fields and exact routes',async()=>{
 const {api,calls}=setup();await api.save('skills',{name:'Writer',systemPrompt:'Write',agent_id:'stale',userId:999},3);await api.remove('skills',3);
 assert.equal(calls[0].args[0],'/admin/llm/skills/3');assert.equal(calls[0].args[1].agent_id,undefined);assert.equal(calls[0].args[1].userId,undefined);
 assert.equal(calls[1].method,'delete');assert.equal(calls[1].args[0],'/admin/llm/skills/3');
});
test('run uses the same gateway client and a gRPC-compatible timeout',async()=>{
 const {api,calls}=setup();await api.run({message:'hello'});
 assert.equal(calls[0].args[0],'/admin/llm/run');assert.equal(calls[0].args[2].timeout,130000);
});
