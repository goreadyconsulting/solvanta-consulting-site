import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=process.cwd();
const pages=['index.html','tools/index.html','about/index.html','contact/index.html','verify/index.html','privacy-policy/index.html','terms/index.html','data-deletion/index.html','certificate-policy/index.html','certificates/index.html','courses/index.html','practice/index.html','404.html'];
for(const retired of ['courses/ai-basics-everyday','assets/js/courses.js','assets/css/editorial-learning.css','assets/css/responsive-polish.css'])if(fs.existsSync(retired))throw Error('Retired file still present: '+retired);
for(const file of ['assets/js/tools.js','assets/js/main.js','assets/js/contact.js','assets/js/verify.js'])execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
for(const file of pages){
 const html=fs.readFileSync(file,'utf8');
 for(const [tag,count] of [['html',1],['head',1],['body',1],['main',1],['header',1],['footer',1],['h1',1]]){
   const opening=(html.match(new RegExp('<'+tag+'(?:\\s|>)','gi'))||[]).length;
   const closing=(html.match(new RegExp('</'+tag+'>','gi'))||[]).length;
   if(opening!==count||closing!==count)throw Error(file+': '+tag+' has '+opening+' openings and '+closing+' endings');
 }
 if(!html.includes('class="sv-site"')||!html.includes('solvanta-tools.css')||!html.includes('data-nav-menu'))throw Error('Not using shared shell: '+file);
 if(html.includes('/assets/css/responsive-polish.css')||html.includes('data-footer-link href="/courses/"'))throw Error('Retired content still linked: '+file);
 for(const match of html.matchAll(/(?:href|src)=["'](\/[^"'#?]+)(?:#[^"']*)?["']/g)){
   const value=match[1],local=path.join(root,decodeURI(value));
   if(!fs.existsSync(local)&&!fs.existsSync(local+'.html'))throw Error(file+': broken local reference '+value);
 }
 for(const match of html.matchAll(/href=["']#([^"']+)/g))if(!html.includes('id="'+match[1]+'"')&&!html.includes("id='"+match[1]+"'"))throw Error(file+': broken fragment #'+match[1]);
}
const oldSite=fs.readFileSync('assets/js/main.js','utf8');
if(oldSite.includes('loadResponsivePolish')||oldSite.includes('innerHTML'))throw Error('Legacy header/footer rewriting remains');
for(const file of ['assets/css/styles.css','assets/css/solvanta-tools.css'])if(!fs.readFileSync(file,'utf8').includes('prefers-reduced-motion'))throw Error('Missing motion preference fallback: '+file);
console.log('All Solvanta pages use a consistent shell and links; JS syntax passed.');
