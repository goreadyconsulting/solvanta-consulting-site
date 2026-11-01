/* Solvanta free utilities. Nothing entered here is sent to a server or saved. */
(()=>{'use strict';
const byId=(id)=>document.getElementById(id);
const show=(id)=>{const el=byId(id);if(el)el.hidden=false};
const status=(id,message)=>{const el=byId(id);if(el)el.textContent=message};
const tidy=(value)=>value.trim().replace(/\s+/g,' ');
const messageForm=byId('sv-message-form');
if(messageForm)messageForm.addEventListener('submit',event=>{
 event.preventDefault();const kind=byId('sv-purpose').value,person=tidy(byId('sv-person').value),topic=tidy(byId('sv-topic').value),detail=tidy(byId('sv-detail').value),tone=byId('sv-tone').value;
 if(!topic){status('sv-message-status','Add a topic to build your message.');return}
 const greeting=person?'Hi '+person+',':'Hello,',line=detail?' '+detail.replace(/[.!?]+$/,'')+'.':'';
 const professional=tone==='professional',short=tone==='direct';
 let body='';
 if(kind==='update')body=(short?'Could you please share an update on ':'I wanted to check whether there is an update on ')+topic+'.'+line+(short?' Thank you.':professional?' Please let me know the current status and expected next steps.':' It would help me plan what to do next. Thanks!');
 if(kind==='followup')body=(short?'Following up on ':'I’m following up about ')+topic+'.'+line+(short?' Please let me know when you can.':professional?' I would appreciate an update when convenient.':' Let me know when you have a moment. Thanks!');
 if(kind==='reschedule')body=(short?'Could we reschedule ':'Would it be possible to reschedule ')+topic+'?'+line+(short?' Please suggest another time.':professional?' Please let me know a suitable alternative time.':' Sorry for the inconvenience—happy to find another time that works. Thanks!');
 if(kind==='thankyou')body=(short?'Thanks for your help with ':'Thank you for your help with ')+topic+'.'+line+(short?' I appreciate it.':professional?' I appreciate your time and support.':' I really appreciate it!');
 const ending=short?'':professional?'\n\nKind regards,':'\n\nBest,';
 byId('sv-message-output').value=greeting+'\n\n'+body+ending;
 show('sv-message-result');status('sv-message-status','Message ready. Review and edit it before sending.');
});
const textForm=byId('sv-text-form');
if(textForm)textForm.addEventListener('submit',event=>{
 event.preventDefault();const raw=byId('sv-text-input').value;
 if(!raw.trim()){status('sv-text-status','Paste some text first.');return}
 const mode=byId('sv-text-mode').value,normalised=raw.replace(/\r\n?/g,'\n');let result='';
 if(mode==='spaces')result=normalised.split('\n').map(l=>l.replace(/[\t ]+/g,' ').trim()).join('\n').trim();
 else if(mode==='lines')result=normalised.split('\n').map(l=>l.trim()).filter(Boolean).join('\n');
 else result=normalised.split('\n').map(l=>l.trim().replace(/^([-*•]|\d+[.)])\s*/,'' )).filter(Boolean).map(l=>'• '+l).join('\n');
 byId('sv-text-output').value=result;show('sv-text-result');status('sv-text-status','Text ready. Your original text has not changed.');
});
const mode=byId('sv-percent-mode');
if(mode)mode.addEventListener('change',()=>{
 const current=mode.value;
 byId('sv-percent-label-a').textContent=current==='of'?'Percentage (%)':current==='share'?'Part':'Starting value';
 byId('sv-percent-label-b').textContent=current==='of'?'Number':current==='share'?'Total':'Ending value';
});
const percentForm=byId('sv-percent-form');
if(percentForm)percentForm.addEventListener('submit',event=>{
 event.preventDefault();const a=Number(byId('sv-percent-a').value),b=Number(byId('sv-percent-b').value),m=mode.value;
 if(!Number.isFinite(a)||!Number.isFinite(b)||byId('sv-percent-a').value===''||byId('sv-percent-b').value===''){status('sv-percent-status','Enter two valid numbers.');return}
 if((m==='share'&&b===0)||(m==='change'&&a===0)){status('sv-percent-status','The comparison value cannot be zero.');byId('sv-percent-result').hidden=true;return}
 const n=m==='of'?a/100*b:m==='share'?a/b*100:(b-a)/Math.abs(a)*100;
 const f=(v)=>Number(v.toFixed(4)).toLocaleString(undefined,{maximumFractionDigits:4});
 byId('sv-percent-output').textContent=f(n)+(m==='of'?'':'%');
 byId('sv-percent-explanation').textContent=m==='of'?f(a)+'% of '+f(b)+' equals '+f(n)+'.':m==='share'?f(a)+' is '+f(n)+'% of '+f(b)+'.':'From '+f(a)+' to '+f(b)+' is a '+(n<0?'decrease':'change')+' of '+f(Math.abs(n))+'%.';
 show('sv-percent-result');status('sv-percent-status','');
});
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
 const field=byId(button.dataset.copy);if(!field)return;
 try{if(!navigator.clipboard||!navigator.clipboard.writeText)throw Error('Unavailable');await navigator.clipboard.writeText(field.value);button.textContent='Copied';}
 catch{field.focus();field.select();button.textContent='Select and copy the text';}
}));
})();
