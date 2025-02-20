import{w as c}from"./proxy-CXCGvyFN.js";import{a as r,n as e,L as d}from"./chunk-IR6S3I6Y-DPo2aVaG.js";import{F as x}from"./index-DL7J5RVS.js";import{P as m}from"./PageTransition-DY475_YN.js";import{a as p}from"./api-BXsSQKvn.js";const h=[{name:"All Categories",count:"2.5k"},{name:"Environment",count:"850"},{name:"Education",count:"420"},{name:"Healthcare",count:"380"},{name:"Community",count:"510"},{name:"Arts & Culture",count:"290"}],u=[{name:"All Locations",count:"2.5k"},{name:"London",count:"850"},{name:"Manchester",count:"420"},{name:"Birmingham",count:"380"},{name:"Leeds",count:"310"},{name:"Liverpool",count:"290"}],o=({type:s})=>{const i={companiesHouse:{label:"UK Companies House Verified",color:"bg-blue-50 text-blue-700 border border-blue-200"},charitiesCommission:{label:"UK Charity Commission Verified",color:"bg-purple-50 text-purple-700 border border-purple-200"}}[s];return e.jsxs("span",{className:`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${i.color} gap-1.5`,title:i.label,children:[i.label,e.jsx(x,{className:"w-3 h-3"})]})},g=({opportunity:s})=>e.jsx("div",{className:"bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200",children:e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("span",{className:"text-2xl",children:s.image||"📋"}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-900",children:s.title}),e.jsx("p",{className:"text-sm text-gray-500",children:s.organization.name})]})]}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[s.organization.companiesHouseVerified&&e.jsx(o,{type:"companiesHouse"}),s.organization.charitiesCommissionVerified&&e.jsx(o,{type:"charitiesCommission"})]})]}),e.jsx("p",{className:"mt-4 text-gray-600",children:s.description}),s.tags&&e.jsx("div",{className:"mt-4 flex flex-wrap gap-2",children:s.tags.map((t,i)=>e.jsx("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800",children:t},i))}),e.jsxs("div",{className:"mt-6 flex justify-between items-center",children:[e.jsx("div",{className:"flex items-center gap-4 text-sm text-gray-500",children:e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{children:"📍"})," ",s.location_name]})}),e.jsx(d,{to:`/opportunity/${s.id}`,className:"inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors",children:"Learn More"})]})]})}),f=()=>{const[s,t]=r.useState([]),[i,l]=r.useState(!0);return r.useEffect(()=>{(async()=>{try{l(!0);const n=await p.get("/opportunities/");t(n)}catch(n){console.error("Error fetching opportunities:",n)}finally{l(!1)}})()},[]),e.jsx(m,{children:e.jsx("div",{className:"min-h-screen bg-white -mt-8",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[e.jsxs("div",{className:"mb-8",children:[e.jsx("h1",{className:"text-3xl font-semibold text-gray-900",children:"Discover Opportunities"}),e.jsx("p",{className:"mt-2 text-gray-600",children:"Explore volunteer opportunities near you"})]}),e.jsxs("div",{className:"flex flex-col lg:flex-row gap-8",children:[e.jsx("div",{className:"lg:w-64 flex-shrink-0",children:e.jsxs("div",{className:"sticky top-24 space-y-8",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 mb-4",children:"Categories"}),e.jsx("div",{className:"space-y-2",children:h.map(a=>e.jsxs("button",{className:"w-full flex justify-between items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors",children:[e.jsx("span",{children:a.name}),e.jsx("span",{className:"text-gray-400",children:a.count})]},a.name))})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 mb-4",children:"Locations"}),e.jsx("div",{className:"space-y-2",children:u.map(a=>e.jsxs("button",{className:"w-full flex justify-between items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors",children:[e.jsx("span",{children:a.name}),e.jsx("span",{className:"text-gray-400",children:a.count})]},a.name))})]})]})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"mb-6 flex flex-col sm:flex-row gap-4",children:[e.jsx("div",{className:"flex-1",children:e.jsx("input",{type:"text",placeholder:"Search opportunities...",className:"w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"})}),e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("select",{className:"px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200",children:[e.jsx("option",{children:"Location"}),e.jsx("option",{children:"Within 5 miles"}),e.jsx("option",{children:"Within 10 miles"}),e.jsx("option",{children:"Within 25 miles"})]}),e.jsxs("select",{className:"px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200",children:[e.jsx("option",{children:"Date"}),e.jsx("option",{children:"Today"}),e.jsx("option",{children:"This Week"}),e.jsx("option",{children:"This Month"})]})]})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:i?e.jsx("div",{className:"col-span-2 text-center py-12",children:e.jsx("div",{className:"animate-pulse",children:"Loading opportunities..."})}):s.length===0?e.jsx("div",{className:"col-span-2 text-center py-12",children:e.jsx("p",{className:"text-gray-500",children:"No opportunities found"})}):s.map(a=>e.jsx(g,{opportunity:a},a.id))})]})]})]})})})},w=c(f);export{w as default};
