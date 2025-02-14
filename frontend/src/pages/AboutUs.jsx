import React, { useEffect, useRef, useState } from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const TEAM_MEMBERS = [
  {
    name: "Amir Dzakwan",
    role: "Co-Founder & Full Stack Developer",
    image: "👨‍💻", // Replace with actual image
    bio: "Computer Science student at the University of Manitoba with a passion for creating technology that makes a positive impact.",
    linkedin: "https://linkedin.com/in/amirdzakwan",
    github: "https://github.com/amirdzakwan"
  },
  {
    name: "Adel Anarbaeyva",
    role: "Co-Founder & Frontend Developer",
    image: "👩‍💻", // Replace with actual image
    bio: "Computer Science student specializing in user experience and frontend development, dedicated to making volunteering accessible to everyone.",
    linkedin: "https://linkedin.com/in/adelanarbaeyva",
    github: "https://github.com/adelanarbaeyva"
  },
  {
    name: "Dylan Farrar",
    role: "Co-Founder & Backend Developer",
    image: "👨‍💻", // Replace with actual image
    bio: "Computer Science student focused on backend architecture and database design, committed to building scalable solutions for social good.",
    linkedin: "https://linkedin.com/in/dylanfarrar",
    github: "https://github.com/dylanfarrar"
  }
];

const TIMELINE = [
  {
    year: "2023",
    title: "Volunteera Launch",
    description: "Platform officially launched with 100+ partner organizations.",
    icon: "🚀"
  },
  {
    year: "2023",
    title: "Beta Testing",
    description: "Successfully completed beta testing with 1,000 volunteers.",
    icon: "🧪"
  },
  {
    year: "2022",
    title: "Development Begins",
    description: "Started development of the Volunteera platform.",
    icon: "💻"
  },
  {
    year: "2022",
    title: "Concept & Research",
    description: "Initial concept development and market research.",
    icon: "💡"
  },
];

const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const currentCount = Math.floor(easeOutQuart * value);
      
      setCount(currentCount);

      if (percentage < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };

    countRef.current = requestAnimationFrame(animate);
    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
};

const IMPACT_STATS = [
  { 
    number: 10000,
    label: "Volunteers",
    icon: "👥",
    description: "Active volunteers making a difference",
    gradient: "from-blue-500 to-indigo-600",
    animation: "slide-right"
  },
  { 
    number: 500,
    label: "Organizations",
    icon: "🏢",
    description: "Partner organizations worldwide",
    gradient: "from-emerald-400 to-green-500",
    animation: "slide-left"
  },
  { 
    number: 50000,
    label: "Hours",
    icon: "⏰",
    description: "Volunteer hours contributed",
    gradient: "from-violet-500 to-purple-600",
    animation: "slide-right"
  },
  { 
    number: 100,
    label: "Communities",
    icon: "🌍",
    description: "Communities positively impacted",
    gradient: "from-orange-400 to-red-500",
    animation: "slide-left"
  },
  { 
    number: 15,
    label: "Countries",
    icon: "🌎",
    description: "Countries where we're making an impact",
    gradient: "from-teal-400 to-cyan-500",
    animation: "slide-right"
  }
];

// Add this SVG map data near your other constants
const WORLD_MAP_PATH = `M48.83,37.9c-0.41,0.04-1.27,0.43-1.27,0.43l-1.44,0.3l-2.21,0.78l-0.26,0.65l0.13,1.43l-2.08,1.95l-2.86,1.04 l-2.34,1.3l-1.17,1.17l-0.39,2.08l0.52,2.34l1.17,1.69l2.21,0.91l1.69,1.3l2.34,2.34l3.12,1.69l2.34,0.13l2.47-0.13l2.86-0.52 l2.34-0.13l1.69,0.13l1.3,0.65l0.65,1.95l0.52,2.47l1.04,1.82l2.47,0.13l2.34-1.04l2.47-1.69l0.52-2.34l-0.26-2.47l-1.69-1.69 l-1.56-2.34l0.13-2.47l1.69-1.69l1.3-2.34l-0.13-2.47l-1.69-1.69l-1.56-2.34l0.13-2.47l1.69-1.69l1.3-2.34l-0.13-2.47l-1.69-1.69 l-1.56-2.34l0.13-2.47l1.69-1.69l1.3-2.34l-0.13-2.47l-1.69-1.69l-1.56-2.34l0.13-2.47l1.69-1.69l1.3-2.34l-0.13-2.47l-1.69-1.69z`;

// Update the FEATURED_COUNTRIES with more accurate coordinates and add country paths
const FEATURED_COUNTRIES = [
  {
    name: "Canada",
    x: "15%",
    y: "20%",
    delay: 0,
    path: "M40,20 L60,20 L65,35 L35,35 Z" // Simplified Canada path
  },
  {
    name: "UK",
    x: "45%",
    y: "25%",
    delay: 0.2,
    path: "M48,30 L50,28 L52,30 L50,32 Z" // Simplified UK path
  },
  {
    name: "Germany",
    x: "48%",
    y: "28%",
    delay: 0.4,
    path: "M50,30 L52,30 L52,32 L50,32 Z" // Simplified Germany path
  },
  {
    name: "India",
    x: "65%",
    y: "45%",
    delay: 0.6,
    path: "M65,40 L70,40 L70,45 L65,45 Z" // Simplified India path
  },
  {
    name: "Australia",
    x: "80%",
    y: "70%",
    delay: 0.8,
    path: "M75,65 L85,65 L85,75 L75,75 Z" // Simplified Australia path
  }
];

const AnimatedSection = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Update the Countries stat section
const CountriesSection = ({ stat, isVisible }) => {
  return (
    <div className="relative w-full aspect-[2/1] max-w-4xl mx-auto">
      <svg 
        viewBox="0 0 100 50" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }}
      >
        {/* Base World Map */}
        <path
          d={WORLD_MAP_PATH}
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.2"
        />

        {/* Highlighted Countries */}
        {FEATURED_COUNTRIES.map((country, i) => (
          <motion.g key={country.name}>
            <motion.path
              d={country.path}
              fill="rgba(255,255,255,0.3)"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { 
                opacity: 1, 
                scale: 1,
              } : {}}
              transition={{
                delay: country.delay + 1,
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
            />
            <motion.circle
              cx={country.x}
              cy={country.y}
              r="0.8"
              fill="white"
              initial={{ scale: 0 }}
              animate={isVisible ? { scale: 1 } : {}}
              transition={{
                delay: country.delay + 1,
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
            />
            <motion.text
              x={country.x}
              y={parseFloat(country.y) + 3}
              fontSize="2"
              fill="white"
              textAnchor="middle"
              initial={{ opacity: 0, y: 5 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: country.delay + 1.2,
                duration: 0.5
              }}
            >
              {country.name}
            </motion.text>
          </motion.g>
        ))}

        {/* Animated Connection Lines */}
        {FEATURED_COUNTRIES.map((country, i) => (
          <motion.line
            key={`line-${i}`}
            x1={country.x}
            y1={country.y}
            x2={FEATURED_COUNTRIES[(i + 1) % FEATURED_COUNTRIES.length].x}
            y2={FEATURED_COUNTRIES[(i + 1) % FEATURED_COUNTRIES.length].y}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.2"
            strokeDasharray="1 1"
            initial={{ pathLength: 0 }}
            animate={isVisible ? { pathLength: 1 } : {}}
            transition={{
              delay: country.delay + 1.5,
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Update the StatSection component
const StatSection = ({ stat, index, isLast }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const content = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
        <div className="text-white text-center md:text-left">
          <div className="text-6xl mb-4">{stat.icon}</div>
          <h3 className="text-3xl font-bold mb-2">{stat.label}</h3>
          <p className="text-white/80">{stat.description}</p>
        </div>
        <div className="text-center">
          <div className="text-5xl md:text-7xl font-bold text-white mb-2">
            {isVisible ? (
              <AnimatedCounter value={stat.number} duration={2500} />
            ) : '0'}
            {stat.label === "Hours" && "+"}
          </div>
        </div>
      </div>
    </div>
  );

  if (stat.label === "Countries") {
    return (
      <div 
        ref={sectionRef}
        className="min-h-[70vh] w-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center"
        style={{ marginTop: '-2px' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-2">{stat.label}</h3>
              <p className="text-white/80">{stat.description}</p>
              <div className="text-7xl font-bold text-white my-8">
                {isVisible ? <AnimatedCounter value={stat.number} duration={2500} /> : '0'}
              </div>
            </div>
            <CountriesSection stat={stat} isVisible={isVisible} />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={sectionRef}
      className="min-h-[70vh] w-full flex items-center"
      style={{ marginTop: '-2px' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`w-full bg-gradient-to-r ${stat.gradient}`}
      >
        <div className="py-20">
          {content}
        </div>
      </motion.div>
    </div>
  );
};

const AboutUs = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section with updated background */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Updated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-center px-4">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Our Mission
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed"
            >
              Connecting passionate volunteers with meaningful opportunities to create positive change in communities worldwide.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="animate-bounce text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Sections - Remove container padding */}
        <div className="w-full -mt-2">
          {IMPACT_STATS.map((stat, index) => (
            <StatSection 
              key={index} 
              stat={stat} 
              index={index}
              isLast={index === IMPACT_STATS.length - 1}
            />
          ))}
        </div>

        {/* About Section */}
        <AnimatedSection delay={0.2}>
          <div className="py-32 bg-gradient-to-b from-transparent to-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">About Volunteera</h2>
              <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
                <p>
                  Volunteera was born from a simple observation: while many people want to volunteer, 
                  finding the right opportunity often proves challenging. Our platform bridges this gap, 
                  making it easier for volunteers to connect with causes they care about.
                </p>
                <p>
                  By combining modern technology with social impact, we're creating a more connected 
                  and engaged volunteering community. Our platform not only helps match volunteers 
                  with opportunities but also helps organizations better manage and engage with their volunteers.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Team Section */}
        <AnimatedSection delay={0.3}>
          <div className="py-32">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {TEAM_MEMBERS.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                        <span className="text-6xl">{member.image}</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-blue-600 mb-4">{member.role}</p>
                      <p className="text-gray-600 mb-6">{member.bio}</p>
                      <div className="flex justify-center space-x-4">
                        <a href={member.linkedin} className="text-gray-400 hover:text-blue-500 transition-colors">
                          <FaLinkedin className="w-6 h-6" />
                        </a>
                        <a href={member.github} className="text-gray-400 hover:text-gray-900 transition-colors">
                          <FaGithub className="w-6 h-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Timeline Section */}
        <AnimatedSection delay={0.4}>
          <div className="py-32">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Our Journey</h2>
            <div className="space-y-12">
              {TIMELINE.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center"
                >
                  <div className={`flex items-center w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-1/2 px-8">
                      <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-4">{event.icon}</span>
                          <span className="text-blue-600 font-semibold">{event.year}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>
                    <div className="w-px h-full bg-gray-200 relative">
                      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600" />
                    </div>
                    <div className="w-1/2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
};

export default AboutUs; 