document.addEventListener("DOMContentLoaded",(function(){jQuery(document).ready((function(e){fetch("./content-1.txt").then((function(e){if(e.ok)return e.text();throw new Error("Error loading file.")})).then((function(e){let t=e.split("\n");document.getElementById("ProjectDetailsTitle").innerHTML=t[0],document.getElementById("testElement").innerHTML=t[1];for(let e=2;e<t.length;e++){var n=document.createElement("li");n.className="ProjectDetailsListItem";let o=t[e].split(":"),c=`  <span  class="ProjectDetailsListItemContent">\n                                                              ${o[0]} :\n                                                            </span>${o[1]}`;n.innerHTML=c,document.getElementById("ProjectDetailsList").appendChild(n)}})).catch((function(e){console.log(e.message)}))}));const e=document.querySelector(".slider"),t=document.querySelectorAll(".slide"),n=document.getElementById("dynamic-indicators");let o=0;function c(){e.style.transform=`translateX(-${100*o}%)`,n.innerHTML="",t.forEach(((e,t)=>{const l=document.createElement("div");l.className="indicator "+(t===o?"active":""),l.onclick=()=>function(e){o=e,c()}(t),n.appendChild(l)}))}c(),setInterval((function(){o=(o+1)%t.length,c()}),5e3)}));