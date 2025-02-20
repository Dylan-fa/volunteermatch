import{w as E}from"./proxy-CXCGvyFN.js";import{a as r,n as e,v as O,o as F,L}from"./chunk-IR6S3I6Y-DPo2aVaG.js";import{b as P,u as z}from"./UserContext-B8aukPVB.js";import{d as $}from"./debounce-DF2UkBAU.js";import{P as q}from"./PageTransition-DY475_YN.js";const T=({onRegisterSuccess:g})=>{const[d,u]=r.useState({email:"",password:"",password2:""}),[o,l]=r.useState(""),i=async n=>{n.preventDefault();try{const c=await fetch("/api/auth/volunteer/register/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}),h=await c.json();if(!c.ok)throw new Error(h.error||"Registration failed");g(h)}catch(c){l(c.message)}},b=async n=>{try{const c=await fetch("/api/auth/google/callback/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({access_token:n.credential,user_type:"volunteer"})}),h=await c.json();if(!c.ok)throw new Error("Google registration failed");g(h)}catch(c){l(c.message)}};return e.jsxs("div",{className:"bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10",children:[o&&e.jsx("div",{className:"mb-4 p-4 bg-red-100 text-red-700 rounded",children:o}),e.jsx(P,{onSuccess:b,onError:()=>l("Google registration failed"),className:"w-full mb-4",containerProps:{allow:"identity-credentials-get"},use_fedcm_for_prompt:!0}),e.jsxs("div",{className:"relative my-6",children:[e.jsx("div",{className:"absolute inset-0 flex items-center",children:e.jsx("div",{className:"w-full border-t border-gray-300"})}),e.jsx("div",{className:"relative flex justify-center text-sm",children:e.jsx("span",{className:"px-2 bg-white text-gray-500",children:"Or continue with email"})})]}),e.jsxs("form",{className:"space-y-6",onSubmit:i,children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-700",children:"Email address"}),e.jsx("input",{id:"email",type:"email",required:!0,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",onChange:n=>u({...d,email:n.target.value})})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700",children:"Password"}),e.jsx("input",{id:"password",type:"password",required:!0,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",onChange:n=>u({...d,password:n.target.value})})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password2",className:"block text-sm font-medium text-gray-700",children:"Confirm Password"}),e.jsx("input",{id:"password2",type:"password",required:!0,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",onChange:n=>u({...d,password2:n.target.value})})]}),e.jsx("div",{children:e.jsx("button",{type:"submit",className:"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",children:"Sign up"})})]})]})},M=({onRegisterSuccess:g})=>{const[d,u]=r.useState(1),[o,l]=r.useState({name:"",charity_number:"",description:"",logo:null,selected_charity_data:null}),[i,b]=r.useState({email:"",username:"",password:"",password2:""}),[n,c]=r.useState(""),[h,m]=r.useState(""),[w,p]=r.useState([]),[S,y]=r.useState(!1),j=r.useRef(null);r.useEffect(()=>{const s=a=>{j.current&&!j.current.contains(a.target)&&setShowResults(!1)};return document.addEventListener("mousedown",s),()=>document.removeEventListener("mousedown",s)},[]);const v=r.useRef($(async s=>{if(s.length<3){p([]),y(!1);return}y(!0);try{const t=(await(await fetch(`/api/charity-search/?q=${encodeURIComponent(s)}`)).json()).sort((f,N)=>f.reg_status==="RM"&&N.reg_status!=="RM"?1:f.reg_status!=="RM"&&N.reg_status==="RM"?-1:f.charity_name.localeCompare(N.charity_name));p(t),t&&t.length>0&&setShowResults(!0)}catch(a){console.error("Search failed:",a)}finally{y(!1)}},700)).current;r.useEffect(()=>()=>{v.cancel()},[v]);const _=s=>{const a=s.target.value;m(a),a.length<3?(p([]),setShowResults(!1)):(y(!0),v(a))},k=async(s,a=0)=>{try{const t=await(await fetch(`/api/charity-details/${s}/${a}`)).json();t.activities&&l(f=>({...f,description:t.activities}))}catch(x){console.error("Failed to fetch charity details:",x)}},C=s=>{l(a=>({...a,name:s.charity_name,charity_number:s.reg_charity_number,selected_charity_data:s})),m(s.charity_name),p([]),setShowResults(!1),s.reg_charity_number&&k(s.reg_charity_number,s.group_subsid_suffix||0)},R=async s=>{s.preventDefault();const a=new FormData,x={...o,...i};Object.keys(x).forEach(t=>{t==="selected_charity_data"&&x[t]?a.append(t,JSON.stringify(x[t])):x[t]!==null&&a.append(t,x[t])});try{const t=await fetch("/api/auth/organization/register/",{method:"POST",body:a}),f=await t.json();if(!t.ok)throw new Error(f.error||"Registration failed");g(f)}catch(t){c(t.message)}},D=e.jsxs("div",{className:"relative",ref:j,children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Search Registered Charity"}),e.jsx("input",{type:"text",className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",placeholder:"Enter charity name or number (min 3 characters)",value:h,onChange:_,onFocus:()=>{w.length>0&&setShowResults(!0)}}),S&&e.jsx("div",{className:"absolute right-3 top-9",children:e.jsxs("svg",{className:"animate-spin h-5 w-5 text-gray-400",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]})}),w.length>0&&e.jsx("div",{className:"absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60",children:w.map(s=>e.jsxs("div",{className:"cursor-pointer hover:bg-gray-100 py-2 px-4",onClick:()=>C(s),children:[e.jsx("div",{className:"font-medium text-gray-900",children:s.charity_name}),e.jsxs("div",{className:"text-sm text-gray-500",children:["Charity Number: ",s.reg_charity_number,s.reg_status==="RM"&&e.jsx("span",{className:"ml-2 text-red-500",children:"(Removed)"})]}),s.date_of_registration&&e.jsxs("div",{className:"text-xs text-gray-400",children:["Registered: ",new Date(s.date_of_registration).toLocaleDateString()]})]},`${s.reg_charity_number}-${s.organisation_number}`))})]});return e.jsxs("div",{className:"bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10",children:[n&&e.jsx("div",{className:"mb-4 p-4 bg-red-100 text-red-700 rounded",children:n}),e.jsx("div",{className:"mb-5",children:e.jsx("div",{className:"border-b border-gray-200",children:e.jsxs("nav",{className:"-mb-px flex",children:[e.jsx("button",{onClick:()=>u(1),className:`${d===1?"border-blue-500 text-blue-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`,children:"Organization Details"}),e.jsx("button",{onClick:()=>u(2),className:`${d===2?"border-blue-500 text-blue-600":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`,children:"Admin User"})]})})}),e.jsx("form",{className:"space-y-6",onSubmit:R,children:d===1?e.jsxs(e.Fragment,{children:[D,e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Description"}),e.jsx("textarea",{required:!0,rows:4,value:o.description,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",onChange:s=>l({...o,description:s.target.value})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Organization Logo"}),e.jsxs("div",{className:"mt-1 flex items-center",children:[e.jsxs("label",{className:"relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500",children:[e.jsxs("span",{className:"inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",children:[e.jsx("svg",{className:"-ml-1 mr-2 h-5 w-5 text-gray-400",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"})}),"Choose File"]}),e.jsx("input",{type:"file",className:"sr-only",accept:"image/*",onChange:s=>l({...o,logo:s.target.files[0]})})]}),o.logo&&e.jsx("span",{className:"ml-3 text-sm text-gray-600",children:o.logo.name})]})]}),e.jsx("div",{children:e.jsx("button",{type:"button",onClick:()=>u(2),className:"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",children:"Next"})})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Email Address"}),e.jsx("input",{type:"email",required:!0,value:i.email,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",onChange:s=>b({...i,email:s.target.value})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Username"}),e.jsx("input",{type:"text",required:!0,value:i.username,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",onChange:s=>b({...i,username:s.target.value})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Password"}),e.jsx("input",{type:"password",required:!0,value:i.password,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",onChange:s=>b({...i,password:s.target.value})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Confirm Password"}),e.jsx("input",{type:"password",required:!0,value:i.password2,className:"mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",onChange:s=>b({...i,password2:s.target.value})})]}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsx("button",{type:"button",onClick:()=>u(1),className:"w-1/2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",children:"Back"}),e.jsx("button",{type:"submit",className:"w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",children:"Register"})]})]})})]})},U=()=>{const g=O(),d=F(),{login:u}=z(),[o,l]=r.useState("volunteer"),[i,b]=r.useState({}),[n,c]=r.useState("");r.useEffect(()=>{var m;(m=g.state)!=null&&m.type&&l(g.state.type)},[g]);const h=m=>{localStorage.setItem("access_token",m.access),localStorage.setItem("refresh_token",m.refresh),u(m.user),m.user.is_volunteer?d("/browse"):d("/dashboard")};return e.jsx(q,{children:e.jsxs("div",{className:"min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"sm:mx-auto sm:w-full sm:max-w-md",children:[e.jsx("h2",{className:"mt-6 text-center text-3xl font-extrabold text-gray-900",children:"Create your account"}),e.jsx("div",{className:"mt-4 flex justify-center",children:e.jsxs("div",{className:"inline-flex rounded-md",role:"group",children:[e.jsx("button",{onClick:()=>l("volunteer"),className:`px-4 py-2 text-sm font-medium rounded-l-md ${o==="volunteer"?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50"}`,children:"Volunteer"}),e.jsx("button",{onClick:()=>l("organization"),className:`px-4 py-2 text-sm font-medium rounded-r-md ${o==="organization"?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-50"}`,children:"Organization"})]})})]}),e.jsxs("div",{className:"mt-8 sm:mx-auto sm:w-full sm:max-w-md",children:[o==="volunteer"?e.jsx(T,{onRegisterSuccess:h}):e.jsx(M,{onRegisterSuccess:h}),e.jsxs("p",{className:"mt-6 text-center text-sm text-gray-600",children:["Already have an account?"," ",e.jsx(L,{to:"/login",className:"font-medium text-blue-600 hover:text-blue-500",children:"Sign in"})]})]})]})})},V=E(U);export{V as default};
