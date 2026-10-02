const $=id=>document.getElementById(id);
if(location.pathname.endsWith("login.html")){
 $("loginForm").onsubmit=async e=>{e.preventDefault();await auth("/api/auth/login",{email:$("email").value,password:$("password").value})}
}else{
 $("registerForm").onsubmit=async e=>{e.preventDefault();await auth("/api/auth/register",{name:$("name").value,email:$("email").value,password:$("password").value})}
}
async function auth(url,body){
 try{let r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});let d=await r.json();
 if(!r.ok)throw new Error(d.message||"Request failed");localStorage.setItem("fitsyncUser",JSON.stringify(d));location.href="/";
 }catch(e){$("msg").textContent=e.message}
}