/* Contact form. An enquiry is reported as received only after the backend confirms it. */
document.addEventListener('DOMContentLoaded',()=>{
 const form=document.getElementById('contactForm');if(!form)return;
 const button=document.getElementById('contactSubmit'),status=document.getElementById('contactStatus');
 const field=id=>document.getElementById(id);
 const support='helpdesk@solvantaconsulting.com';
 function show(message,type,link){status.replaceChildren();const text=document.createTextNode(message);status.append(text);if(link){const a=document.createElement('a');a.href='mailto:'+support;a.textContent=support;status.append(a)}status.className='form-status'+(type?' '+type:'')}
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  const name=field('contactName').value.trim(),email=field('contactEmail').value.trim(),message=field('contactMessage').value.trim(),consent=field('contactConsent').checked,interest=field('contactCourseInterest').value;
  if(!name){show('Enter your name.','error');return}
  if(!email||!field('contactEmail').checkValidity()){show('Enter a valid email address.','error');return}
  if(!message){show('Enter your message.','error');return}
  if(!consent){show('Please agree to the contact information notice.','error');return}
  const apiUrl=window.SOLVANTA_CONFIG?.API_URL;
  if(!apiUrl||apiUrl==='PASTE_APPS_SCRIPT_URL_HERE'){show('Online submission is not available. Please email us at ','error',true);return}
  button.disabled=true;button.textContent='Sending…';show('Sending your message…','');
  try{
   const payload={action:'submitEnquiry',name,email,phone:'',courseInterest:interest,message,sourcePage:location.pathname,timestamp:new Date().toISOString()};
   // text/plain avoids the extra CORS preflight that application/json causes for Apps Script.
   const response=await fetch(apiUrl,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
   if(!response.ok)throw Error('No valid backend response');
   const data=await response.json();
   if(data?.success===true){show('Your message was received. Thank you for getting in touch.','success');form.reset()}
   else{show('We could not confirm delivery. Please email us at ','error',true)}
  }catch(err){console.warn('Contact submission could not be confirmed',err);show('We could not confirm delivery. Please email us at ','error',true)}
  finally{button.disabled=false;button.textContent='Send message'}
 });
});
