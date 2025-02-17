import{w as b,m as l}from"./proxy-Bff0xxqS.js";import{n as e,a as o}from"./chunk-IR6S3I6Y-BEDlfGdp.js";import{a as v,b as j}from"./index-CgaG-kyc.js";import{P as w}from"./PageTransition-DMUUi-KG.js";const N=[{name:"Amir Dzakwan",role:"Co-Founder & Full Stack Developer",image:"👨‍💻",bio:"Computer Science student at the University of Manitoba with a passion for creating technology that makes a positive impact.",linkedin:"https://linkedin.com/in/amirdzakwan",github:"https://github.com/amirdzakwan"},{name:"Adel Anarbaeyva",role:"Co-Founder & Frontend Developer",image:"👩‍💻",bio:"Computer Science student specializing in user experience and frontend development, dedicated to making volunteering accessible to everyone.",linkedin:"https://linkedin.com/in/adelanarbaeyva",github:"https://github.com/adelanarbaeyva"},{name:"Dylan Farrar",role:"Co-Founder & Backend Developer",image:"👨‍💻",bio:"Computer Science student focused on backend architecture and database design, committed to building scalable solutions for social good.",linkedin:"https://linkedin.com/in/dylanfarrar",github:"https://github.com/dylanfarrar"}],k=[{year:"2023",title:"Volunteera Launch",description:"Platform officially launched with 100+ partner organizations.",icon:"🚀"},{year:"2023",title:"Beta Testing",description:"Successfully completed beta testing with 1,000 volunteers.",icon:"🧪"},{year:"2022",title:"Development Begins",description:"Started development of the Volunteera platform.",icon:"💻"},{year:"2022",title:"Concept & Research",description:"Initial concept development and market research.",icon:"💡"}],p=({value:t,duration:a=2e3})=>{const[i,n]=o.useState(0),r=o.useRef(null),s=o.useRef(null);return o.useEffect(()=>{const c=d=>{s.current||(s.current=d);const x=d-s.current,u=Math.min(x/a,1),g=1-Math.pow(1-u,4),y=Math.floor(g*t);n(y),u<1&&(r.current=requestAnimationFrame(c))};return r.current=requestAnimationFrame(c),()=>{r.current&&cancelAnimationFrame(r.current)}},[t,a]),e.jsx(e.Fragment,{children:i.toLocaleString()})},f=[{number:1e4,label:"Volunteers",icon:"👥",description:"Active volunteers making a difference",gradient:"from-blue-500 to-indigo-600",animation:"slide-right"},{number:500,label:"Organizations",icon:"🏢",description:"Partner organizations worldwide",gradient:"from-emerald-400 to-green-500",animation:"slide-left"},{number:5e4,label:"Hours",icon:"⏰",description:"Volunteer hours contributed",gradient:"from-violet-500 to-purple-600",animation:"slide-right"},{number:100,label:"Communities",icon:"🌍",description:"Communities positively impacted",gradient:"from-orange-400 to-red-500",animation:"slide-left"},{number:15,label:"Countries",icon:"🌎",description:"Countries where we're making an impact",gradient:"from-teal-400 to-cyan-500",animation:"slide-right"}],L="M48.83,37.9c-0.41,0.04-1.27,0.43-1.27,0.43l-1.44,0.3l-2.21,0.78l-0.26,0.65l0.13,1.43l-2.08,1.95l-2.86,1.04 l-2.34,1.3l-1.17,1.17l-0.39,2.08l0.52,2.34l1.17,1.69l2.21,0.91l1.69,1.3l2.34,2.34l3.12,1.69l2.34,0.13l2.47-0.13l2.86-0.52 l2.34-0.13l1.69,0.13l1.3,0.65l0.65,1.95l0.52,2.47l1.04,1.82l2.47,0.13l2.34-1.04l2.47-1.69l0.52-2.34l-0.26-2.47l-1.69-1.69 l-1.56-2.34l0.13-2.47l1.69-1.69l1.3-2.34l-0.13-2.47l-1.69-1.69l-1.56-2.34l0.13-2.47l1.69-1.69l1.3-2.34l-0.13-2.47l-1.69-1.69 l-1.56-2.34l0.13-2.47l1.69-1.69l1.3-2.34l-0.13-2.47l-1.69-1.69l-1.56-2.34l0.13-2.47l1.69-1.69l1.3-2.34l-0.13-2.47l-1.69-1.69z",m=[{name:"Canada",x:"15%",y:"20%",delay:0,path:"M40,20 L60,20 L65,35 L35,35 Z"},{name:"UK",x:"45%",y:"25%",delay:.2,path:"M48,30 L50,28 L52,30 L50,32 Z"},{name:"Germany",x:"48%",y:"28%",delay:.4,path:"M50,30 L52,30 L52,32 L50,32 Z"},{name:"India",x:"65%",y:"45%",delay:.6,path:"M65,40 L70,40 L70,45 L65,45 Z"},{name:"Australia",x:"80%",y:"70%",delay:.8,path:"M75,65 L85,65 L85,75 L75,75 Z"}],h=({children:t,delay:a=0})=>{const[i,n]=o.useState(!1),r=o.useRef(null);return o.useEffect(()=>{const s=new IntersectionObserver(([c])=>{c.isIntersecting&&(n(!0),s.disconnect())},{threshold:.1});return r.current&&s.observe(r.current),()=>s.disconnect()},[]),e.jsx("div",{ref:r,className:"w-full",children:e.jsx(l.div,{initial:{opacity:0,y:50},animate:i?{opacity:1,y:0}:{opacity:0,y:50},transition:{duration:.8,delay:a},children:t})})},C=({stat:t,isVisible:a})=>e.jsx("div",{className:"relative w-full aspect-[2/1] max-w-4xl mx-auto",children:e.jsxs("svg",{viewBox:"0 0 100 50",className:"w-full h-full",style:{filter:"drop-shadow(0 0 10px rgba(0,0,0,0.1))"},children:[e.jsx("path",{d:L,fill:"rgba(255,255,255,0.1)",stroke:"rgba(255,255,255,0.2)",strokeWidth:"0.2"}),m.map((i,n)=>e.jsxs(l.g,{children:[e.jsx(l.path,{d:i.path,fill:"rgba(255,255,255,0.3)",initial:{opacity:0,scale:.8},animate:a?{opacity:1,scale:1}:{},transition:{delay:i.delay+1,duration:.5,type:"spring",stiffness:100}}),e.jsx(l.circle,{cx:i.x,cy:i.y,r:"0.8",fill:"white",initial:{scale:0},animate:a?{scale:1}:{},transition:{delay:i.delay+1,duration:.5,type:"spring",stiffness:200}}),e.jsx(l.text,{x:i.x,y:parseFloat(i.y)+3,fontSize:"2",fill:"white",textAnchor:"middle",initial:{opacity:0,y:5},animate:a?{opacity:1,y:0}:{},transition:{delay:i.delay+1.2,duration:.5},children:i.name})]},i.name)),m.map((i,n)=>e.jsx(l.line,{x1:i.x,y1:i.y,x2:m[(n+1)%m.length].x,y2:m[(n+1)%m.length].y,stroke:"rgba(255,255,255,0.2)",strokeWidth:"0.2",strokeDasharray:"1 1",initial:{pathLength:0},animate:a?{pathLength:1}:{},transition:{delay:i.delay+1.5,duration:1.5,ease:"easeInOut"}},`line-${n}`))]})}),A=({stat:t,index:a,isLast:i})=>{const[n,r]=o.useState(!1),s=o.useRef(null);o.useEffect(()=>{const d=new IntersectionObserver(([x])=>{x.isIntersecting&&(r(!0),d.disconnect())},{threshold:.2});return s.current&&d.observe(s.current),()=>d.disconnect()},[]);const c=e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full",children:e.jsxs("div",{className:"flex flex-col md:flex-row items-center justify-between gap-8 h-full",children:[e.jsxs("div",{className:"text-white text-center md:text-left",children:[e.jsx("div",{className:"text-6xl mb-4",children:t.icon}),e.jsx("h3",{className:"text-3xl font-bold mb-2",children:t.label}),e.jsx("p",{className:"text-white/80",children:t.description})]}),e.jsx("div",{className:"text-center",children:e.jsxs("div",{className:"text-5xl md:text-7xl font-bold text-white mb-2",children:[n?e.jsx(p,{value:t.number,duration:2500}):"0",t.label==="Hours"&&"+"]})})]})});return t.label==="Countries"?e.jsx("div",{ref:s,className:"min-h-[70vh] w-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center",style:{marginTop:"-2px"},children:e.jsx(l.div,{initial:{opacity:0},animate:n?{opacity:1}:{},transition:{duration:.8},className:"w-full",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20",children:[e.jsxs("div",{className:"text-center mb-12",children:[e.jsx("h3",{className:"text-3xl font-bold text-white mb-2",children:t.label}),e.jsx("p",{className:"text-white/80",children:t.description}),e.jsx("div",{className:"text-7xl font-bold text-white my-8",children:n?e.jsx(p,{value:t.number,duration:2500}):"0"})]}),e.jsx(C,{stat:t,isVisible:n})]})})}):e.jsx("div",{ref:s,className:"min-h-[70vh] w-full flex items-center",style:{marginTop:"-2px"},children:e.jsx(l.div,{initial:{opacity:0},animate:n?{opacity:1}:{},transition:{duration:.8,delay:.2},className:`w-full bg-gradient-to-r ${t.gradient}`,children:e.jsx("div",{className:"py-20",children:c})})})},M=()=>e.jsx(w,{children:e.jsxs("div",{className:"min-h-screen",children:[e.jsxs(l.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:1},className:"relative h-screen flex items-center justify-center overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600"}),e.jsx("div",{className:"absolute inset-0 bg-black/30"}),e.jsxs("div",{className:"relative z-10 text-center px-4",children:[e.jsx(l.h1,{initial:{y:20,opacity:0},animate:{y:0,opacity:1},transition:{delay:.5,duration:.8},className:"text-5xl md:text-7xl font-bold text-white mb-6",children:"Our Mission"}),e.jsx(l.p,{initial:{y:20,opacity:0},animate:{y:0,opacity:1},transition:{delay:.8,duration:.8},className:"text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed",children:"Connecting passionate volunteers with meaningful opportunities to create positive change in communities worldwide."})]}),e.jsx(l.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:1.2,duration:1},className:"absolute bottom-10 left-1/2 transform -translate-x-1/2",children:e.jsx("div",{className:"animate-bounce text-white",children:e.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M19 14l-7 7m0 0l-7-7m7 7V3"})})})})]}),e.jsx("div",{className:"w-full -mt-2",children:f.map((t,a)=>e.jsx(A,{stat:t,index:a,isLast:a===f.length-1},a))}),e.jsx(h,{delay:.2,children:e.jsx("div",{className:"py-32 bg-gradient-to-b from-transparent to-gray-50",children:e.jsxs("div",{className:"max-w-4xl mx-auto text-center",children:[e.jsx("h2",{className:"text-4xl font-bold text-gray-900 mb-8",children:"About Volunteera"}),e.jsxs("div",{className:"prose prose-lg max-w-none text-gray-600 space-y-6",children:[e.jsx("p",{children:"Volunteera was born from a simple observation: while many people want to volunteer, finding the right opportunity often proves challenging. Our platform bridges this gap, making it easier for volunteers to connect with causes they care about."}),e.jsx("p",{children:"By combining modern technology with social impact, we're creating a more connected and engaged volunteering community. Our platform not only helps match volunteers with opportunities but also helps organizations better manage and engage with their volunteers."})]})]})})}),e.jsx(h,{delay:.3,children:e.jsxs("div",{className:"py-32",children:[e.jsx("h2",{className:"text-4xl font-bold text-gray-900 text-center mb-16",children:"Meet Our Team"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12",children:N.map((t,a)=>e.jsx(l.div,{initial:{y:50,opacity:0},whileInView:{y:0,opacity:1},viewport:{once:!0},transition:{delay:a*.2},className:"group",children:e.jsx("div",{className:"bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center",children:e.jsx("span",{className:"text-6xl",children:t.image})}),e.jsx("h3",{className:"text-2xl font-semibold text-gray-900",children:t.name}),e.jsx("p",{className:"text-blue-600 mb-4",children:t.role}),e.jsx("p",{className:"text-gray-600 mb-6",children:t.bio}),e.jsxs("div",{className:"flex justify-center space-x-4",children:[e.jsx("a",{href:t.linkedin,className:"text-gray-400 hover:text-blue-500 transition-colors",children:e.jsx(v,{className:"w-6 h-6"})}),e.jsx("a",{href:t.github,className:"text-gray-400 hover:text-gray-900 transition-colors",children:e.jsx(j,{className:"w-6 h-6"})})]})]})})},a))})]})}),e.jsx(h,{delay:.4,children:e.jsxs("div",{className:"py-32",children:[e.jsx("h2",{className:"text-4xl font-bold text-gray-900 text-center mb-16",children:"Our Journey"}),e.jsx("div",{className:"space-y-12",children:k.map((t,a)=>e.jsx(l.div,{initial:{x:a%2===0?-50:50,opacity:0},whileInView:{x:0,opacity:1},viewport:{once:!0},transition:{delay:a*.2},className:"flex items-center",children:e.jsxs("div",{className:`flex items-center w-full ${a%2===0?"flex-row":"flex-row-reverse"}`,children:[e.jsx("div",{className:"w-1/2 px-8",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105",children:[e.jsxs("div",{className:"flex items-center mb-4",children:[e.jsx("span",{className:"text-3xl mr-4",children:t.icon}),e.jsx("span",{className:"text-blue-600 font-semibold",children:t.year})]}),e.jsx("h3",{className:"text-xl font-semibold text-gray-900 mb-2",children:t.title}),e.jsx("p",{className:"text-gray-600",children:t.description})]})}),e.jsx("div",{className:"w-px h-full bg-gray-200 relative",children:e.jsx("div",{className:"absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600"})}),e.jsx("div",{className:"w-1/2"})]})},a))})]})})]})}),E=b(M);export{E as default};
