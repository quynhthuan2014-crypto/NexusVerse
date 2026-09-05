import test from 'node:test';import assert from 'node:assert/strict';
test('project package is valid',async()=>{const pkg=await import('../package.json',{with:{type:'json'}});assert.equal(pkg.default.name,'nexusverse');assert.equal(pkg.default.type,'module')});
test('server source is syntactically valid',async()=>{const {spawnSync}=await import('node:child_process');const r=spawnSync(process.execPath,['--check','server/server.js'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr)});
test('client source is syntactically valid',async()=>{const {spawnSync}=await import('node:child_process');const r=spawnSync(process.execPath,['--check','client/app.js'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr)});
