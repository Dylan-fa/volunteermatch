import{w as h}from"./proxy-CXCGvyFN.js";import{t as g,a as n,n as e,L as u}from"./chunk-IR6S3I6Y-DPo2aVaG.js";import{P as j}from"./PageTransition-DY475_YN.js";import{a as l}from"./api-BXsSQKvn.js";const y=()=>{var c,d,m;const{id:r}=g(),[s,o]=n.useState(null),i=n.useRef(null);n.useEffect(()=>{(async()=>{try{const a=await l.get(`/opportunities/${r}/`);o(a),x(a)}catch(a){console.error("Error fetching opportunity:",a)}})()},[r]);const x=t=>{if(!window.google||!i.current||!t.latitude||!t.longitude)return;const a=new window.google.maps.Map(i.current,{zoom:15,center:{lat:t.latitude,lng:t.longitude}});new window.google.maps.Marker({position:{lat:t.latitude,lng:t.longitude},map:a,title:t.title})},p=async()=>{try{await l.post(`/opportunities/${r}/apply/`);const t=await l.get(`/opportunities/${r}/`);o(t)}catch(t){console.error("Error applying:",t)}};return s?e.jsx(j,{children:e.jsx("div",{className:"min-h-screen bg-white",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:[e.jsx("nav",{className:"mb-8",children:e.jsx(u,{to:"/browse",className:"text-sm text-gray-500 hover:text-gray-900",children:"← Back to opportunities"})}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-12",children:[e.jsx("div",{className:"lg:col-span-2",children:e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-6xl mb-6",children:((c=s.image)==null?void 0:c.logo)||((d=s.image)==null?void 0:d.name)||"📷"}),e.jsx("h1",{className:"text-3xl font-semibold text-gray-900",children:s.title}),e.jsxs("div",{className:"mt-4 flex items-center space-x-4",children:[e.jsx("span",{className:"inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800",children:s.category}),e.jsx("span",{className:"text-gray-500",children:"•"}),e.jsx("span",{className:"text-gray-500",children:(m=s.organization)==null?void 0:m.name})]})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-medium text-gray-900 mb-4",children:"About this opportunity"}),e.jsx("p",{className:"text-gray-600",children:s.description})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-medium text-gray-900 mb-4",children:"Requirements"}),e.jsx("ul",{className:"space-y-2",children:s.requirements&&s.requirements.split(`
`).filter(t=>t.trim()).map((t,a)=>e.jsxs("li",{className:"flex items-center text-gray-600",children:[e.jsx("svg",{className:"h-5 w-5 mr-2 text-green-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M5 13l4 4L19 7"})}),t.trim()]},a))})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-xl font-medium text-gray-900 mb-4",children:"Your Impact"}),e.jsx("p",{className:"text-gray-600",children:s.impact})]})]})}),e.jsx("div",{className:"lg:col-span-1",children:e.jsxs("div",{className:"sticky top-24 bg-gray-50 rounded-xl p-6 space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-900 mb-2",children:"Date & Time"}),e.jsx("p",{className:"text-gray-600",children:s.date})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-900 mb-2",children:"Location"}),e.jsxs("div",{className:"flex items-center text-gray-600",children:[e.jsxs("svg",{className:"h-4 w-4 mr-1",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M15 11a3 3 0 11-6 0 3 3 0 016 0z"})]}),s.location_name]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-900 mb-2",children:"Time Commitment"}),e.jsx("p",{className:"text-gray-600",children:s.commitment})]}),e.jsx("button",{className:"w-full px-6 py-3 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors",onClick:p,disabled:s.has_applied,children:s.has_applied?"Applied":"Apply Now"}),e.jsx("button",{className:"w-full px-6 py-3 text-sm font-medium rounded-full text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors",children:"Share Opportunity"})]})})]}),e.jsx("div",{ref:i,className:"w-full h-[300px] rounded-lg overflow-hidden"})]})})}):null},b=h(y);export{b as default};
