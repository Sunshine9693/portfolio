import assert from 'node:assert/strict';
const base = process.env.PORTFOLIO_API_URL;
const origin = process.env.PORTFOLIO_SITE_URL;
const username = process.env.PORTFOLIO_ADMIN_USERNAME;
const password = process.env.PORTFOLIO_ADMIN_PASSWORD;
assert.ok(base && origin && username && password, 'Set PORTFOLIO_API_URL, PORTFOLIO_SITE_URL, PORTFOLIO_ADMIN_USERNAME, and PORTFOLIO_ADMIN_PASSWORD.');
const loginResponse=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({username,password})});
assert.equal(loginResponse.status,200,'Production sign-in');
assert.equal(loginResponse.headers.get('access-control-allow-origin'),origin,'Frontend CORS');
const login=await loginResponse.json();assert.ok(login.token);
const headers={Authorization:`Bearer ${login.token}`};
const me=await fetch(base+'/api/auth/me',{headers});assert.equal(me.status,200,'Authenticated session');
const anonymous=await fetch(base+'/api/content/section',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({section:'projects',data:[]})});assert.equal(anonymous.status,401,'Anonymous writes blocked');
const content=await (await fetch(base+'/api/content')).json();
const projects=content.data.projects;
const save=await fetch(base+'/api/content/section',{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({section:'projects',data:projects})});
assert.equal(save.status,200,'Project save');
const fresh=await (await fetch(base+'/api/content')).json();assert.deepEqual(fresh.data.projects,projects,'Projects persist');
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j1ZkAAAAASUVORK5CYII=','base64');
for(const [kind,bytes,type,filename] of [['photo',png,'image/png','verification-photo.png'],['certificate',Buffer.from('%PDF-1.4\n%portfolio storage verification\n%%EOF'),'application/pdf','verification-certificate.pdf']]) {
 let url;
 try {
  const form=new FormData();form.append('file',new Blob([bytes],{type}),filename);
  const response=await fetch(base+'/api/content/media/'+kind,{method:'POST',headers,body:form});
  const result=await response.json();assert.equal(response.status,201,kind+' upload: '+result.message);url=result.fileUrl;
  const download=await fetch(base+url);assert.equal(download.status,200,kind+' retrieval');
  assert.equal(download.headers.get('content-type'),type);assert.deepEqual(Buffer.from(await download.arrayBuffer()),bytes,kind+' data intact');
  assert.match(download.headers.get('cache-control'),/immutable/);
 } finally {
  if(url){const deletion=await fetch(base+'/api/content/upload/'+url.split('/').pop(),{method:'DELETE',headers});assert.equal(deletion.status,200,'Delete verification upload');}
 }
}
const invalid=new FormData();invalid.append('file',new Blob(['invalid'],{type:'image/png'}),'invalid.png');
const rejected=await fetch(base+'/api/content/media/photo',{method:'POST',headers,body:invalid});assert.equal(rejected.status,400,'Invalid file signatures rejected');
console.log('PASS: production sign-in, frontend CORS, session verification, anonymous write protection, project save/readback, durable PNG and PDF upload/retrieval/deletion, invalid file rejection.');
