const user=JSON.parse(localStorage.getItem("fitsyncUser")||"null");
if(!user) location.href="/login.html";
const uid=user?.userId;
let dashboardData=null, chart=null;
const $=id=>document.getElementById(id);
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>showSection(b.dataset.section));
function showSection(id){document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.section===id));$(id).classList.add("active");if(id==="workout")loadWorkout()}
$("logout").onclick=()=>{localStorage.removeItem("fitsyncUser");location.href="/login.html"};
async function api(url,opts={}){let r=await fetch(url,opts);let d=await r.json();if(!r.ok)throw new Error(d.message||"Request failed");return d}
async function load(){
 dashboardData=await api("/api/dashboard/"+uid);const u=dashboardData.user;
 $("hello").textContent="Welcome back, "+u.name.split(" ")[0];
 $("avatar").textContent=u.name[0].toUpperCase();
 $("score").textContent=dashboardData.fitnessScore;$("xp").textContent=dashboardData.xp;$("streak").textContent=dashboardData.streak;
 $("minutes").textContent=dashboardData.weeklyMinutes;$("workouts").textContent=dashboardData.weeklyWorkouts;$("insight").textContent=dashboardData.insight;
 $("planTitle").textContent=dashboardData.todayPlan.title;
 $("planMeta").textContent=`${dashboardData.todayPlan.durationMinutes} min • ${dashboardData.todayPlan.difficulty} • ${dashboardData.todayPlan.goal}`;
 fillProfile(u);drawChart(dashboardData.activities);renderWorkout(dashboardData.todayPlan)
}
function drawChart(acts){let counts={};for(let i=6;i>=0;i--){let d=new Date();d.setDate(d.getDate()-i);counts[d.toISOString().slice(0,10)]=0}
acts.forEach(a=>{if(counts[a.activityDate]!=null)counts[a.activityDate]+=a.durationMinutes||0});
let labels=Object.keys(counts).map(x=>x.slice(5));let vals=Object.values(counts);if(chart)chart.destroy();
chart=new Chart($("activityChart"),{type:"bar",data:{labels,datasets:[{label:"Minutes",data:vals,borderRadius:7}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}})
}
async function loadWorkout(){let w=await api("/api/workout/"+uid);renderWorkout(w)}
function renderWorkout(w){$("workoutBox").innerHTML=`<h2>${w.title}</h2><p>${w.durationMinutes} minutes • ${w.difficulty} • Goal: ${w.goal}</p>`+w.exercises.map((x,i)=>`<div class="exercise"><b>${i+1}. ${x}</b><span>Perform at a comfortable, controlled pace.</span></div>`).join("")}
async function completeWorkout(){let w=dashboardData?.todayPlan||await api("/api/workout/"+uid);await api("/api/activities/"+uid,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"Home workout",durationMinutes:w.durationMinutes,perceivedDifficulty:5,energyLevel:7,sleepQuality:7,soreness:2,completed:true})});alert("Workout logged. Your plan and Fitness Score have been updated.");load()}
$("activityForm").onsubmit=async e=>{e.preventDefault();try{await api("/api/activities/"+uid,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:$("type").value,durationMinutes:+$("duration").value,distanceKm:+$("distance").value,perceivedDifficulty:+$("difficulty").value,energyLevel:+$("energy").value,sleepQuality:+$("sleep").value,soreness:+$("soreness").value,completed:true})});$("activityMsg").textContent="Activity saved successfully.";e.target.reset();load()}catch(err){$("activityMsg").textContent=err.message}}
function fillProfile(u){$("name").value=u.name||"";$("age").value=u.age||"";$("heightCm").value=u.heightCm||"";$("weightKg").value=u.weightKg||"";$("experience").value=u.fitnessExperience||"Beginner";$("activityLevel").value=u.activityLevel||"Low";$("availableMinutes").value=u.availableMinutes||20;$("equipment").value=u.equipment||"";$("workoutTypes").value=u.preferredWorkoutTypes||"";$("goal").value=[...(u.goals||["Improve general fitness"])][0]}
$("profileForm").onsubmit=async e=>{e.preventDefault();try{await api("/api/users/"+uid+"/profile",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:$("name").value,age:+$("age").value,heightCm:+$("heightCm").value,weightKg:+$("weightKg").value,fitnessExperience:$("experience").value,activityLevel:$("activityLevel").value,availableMinutes:+$("availableMinutes").value,equipment:$("equipment").value,preferredWorkoutTypes:$("workoutTypes").value,goals:[$("goal").value]})});$("profileMsg").textContent="Profile updated.";load()}catch(err){$("profileMsg").textContent=err.message}}
function askCoach(){let q=$("question").value.trim();if(!q)return;let chat=$("chat");chat.innerHTML+=`<div class="bubble user">${escapeHtml(q)}</div>`;let ans=coachAnswer(q.toLowerCase());chat.innerHTML+=`<div class="bubble bot">${ans}</div>`;$("question").value=""}
function coachAnswer(q){let w=dashboardData?.todayPlan;if(q.includes("15")||q.includes("10 minutes"))return"Try a short movement reset: 2 minutes marching, 2 minutes squats/wall push-ups, 3 minutes mobility, and 3 minutes easy walking. The goal is consistency, not perfection.";if(q.includes("missed"))return"Don't double up automatically. Resume with today's manageable session and use your recent workload and energy level to guide intensity.";if(q.includes("score"))return`Your current Fitness Score is ${dashboardData?.fitnessScore||0}. It reflects recent activity, workout completion and consistency signals available to FitSync.`;return`Based on your current plan, try ${w?.title||"today's recommended session"} for about ${w?.durationMinutes||20} minutes. Keep the effort controlled and adjust if you feel significant discomfort.`}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
load();