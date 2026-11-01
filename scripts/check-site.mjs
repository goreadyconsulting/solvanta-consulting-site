import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root=process.cwd();
const required=['index.html','tools/index.html','about/index.html','contact/index.html','verify/index.html','assets/js/tools.js','assets/css/solvanta-tools.css','404.html','sitemap.xml','robots.txt'];
for(const file of required){if(!fs.existsSync(path.join(root,file)))throw new Error('Missing '+file)}
for(const retired of ['courses/ai-basics-everyday','assets/js/courses.js','assets/css/editorial-learning.css'])if(fs.existsSync(path.join(root,retired)))throw new Error('Retired content remains: '+retired);
for(const file of ['assets/js/tools.js','assets/js/main.js','assets/js/contact.js','assets/js/verify.js'])execFileSync(process.execPath,['--check',file],{cwd:root,stdio:'inherit'});
const pages=['index.html','tools/index.html','about/index.html','contact/index.html','courses/index.html','practice/index.html','verify/index.html','certificate-policy/index.html','certificates/index.html','404.html'];
for(const file of pages){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 if(!html.includes('<main id="main-content"')&&!html.includes("<main id='main-content'"))throw new Error('Missing main landmark: '+file);
 if((html.match(/<h1\b/g)||[]).length!==1)throw new Error('H1 count differs from 1: '+file);
 for(const match of html.matchAll(/href=["'](\/[^"'#?]+)(?:#[^"']*)?["']/g)){
  const target=match[1],local=path.join(root,decodeURI(target));
  if(!fs.existsSync(local)&&!fs.existsSync(local+'.html'))throw new Error(file+': broken local link '+target);
 }
}
console.log('Solvanta static checks passed.');
