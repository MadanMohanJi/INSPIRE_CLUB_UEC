import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Video, 
  Calendar, 
  Users, 
  Menu, 
  X, 
  Clock, 
  MapPin, 
  Mail, 
  Instagram, 
  Linkedin, 
  Lock, 
  LogOut, 
  Plus, 
  Trash2, 
  FileText, 
  Zap, 
  Globe, 
  FolderPlus, 
  Camera, 
  Landmark, 
  Award, 
  Lightbulb, 
  Sparkles, 
  Quote, 
  ArrowRight,
  Book,
  UserCircle,
  Heart,
  Download,
  Youtube,
  Cpu,
  Code,
  Brain,
  HeartHandshake,
  Sun,
  Moon, 
  Smile,
  GraduationCap,
  History,
  Link as LinkIcon,
  ExternalLink,
  Image as ImageIcon,
  Palette // Added Palette icon for Theme Editor
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBhMLyPLJ8s0P56uXlIqIFcbjvL3Am5TJg",
  authDomain: "flutter-ai-playground-452d7.firebaseapp.com",
  projectId: "flutter-ai-playground-452d7",
  storageBucket: "flutter-ai-playground-452d7.firebasestorage.app",
  messagingSenderId: "761849874992",
  appId: "1:761849874992:web:7e4c1f553c07fca1e53bf5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const APP_ID = 'inspire-club-uec-prod'; 

// --- DATA CONSTANTS ---

const CLUB_INFO = {
  name: "INSPIRE CLUB UEC",
  tagline: "Culture. Education. Leadership.",
  logo: "https://drive.google.com/file/d/1q7J6ZAX1yOaNQhBl1oonhlxXfpBQlwxj/view?usp=sharing", 
  stats: [
    { label: "Centers", value: "70+" },
    { label: "Institutes", value: "100+" },
    { label: "Members", value: "5000+" }
  ]
};

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const BRANCHES_YR1 = ["Group A (CSE/ECE/EE)", "Group B (CM/CE/ME)"];
const BRANCHES_SENIOR = ["CSE", "ECE", "EE", "ME", "CE", "CM"];

const getBranchesForSemester = (sem) => {
  return sem <= 2 ? BRANCHES_YR1 : BRANCHES_SENIOR;
};

// --- HELPER FUNCTIONS ---

const getOptimizedImageUrl = (url) => {
  if (!url) return '';
  let fileId = null;
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) fileId = fileMatch[1];
  
  if (!fileId) {
     const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
     if (idMatch && idMatch[1]) fileId = idMatch[1];
  }

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
  }
  return url;
};

// --- SUB-COMPONENTS ---

const ClubLogo = ({ className }) => (
  <div className={`relative overflow-hidden rounded-full flex items-center justify-center bg-white shadow-sm border border-amber-200 ${className}`}>
    <img 
      src={getOptimizedImageUrl(CLUB_INFO.logo)} 
      alt="Inspire Club Logo" 
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.parentElement.classList.add('bg-amber-500');
        e.target.parentElement.innerHTML = '<span class="text-white font-bold text-xs">UEC</span>';
      }}
    />
  </div>
);

const Navbar = ({ activeTab, setActiveTab, isAdmin, setShowLogin, mobileMenuOpen, setMobileMenuOpen, isDarkMode }) => (
  <nav className={`${isDarkMode ? 'bg-slate-900 text-white border-slate-800' : 'bg-white/95 text-slate-800 border-amber-100'} backdrop-blur-sm sticky top-0 z-50 shadow-md border-b transition-colors duration-300`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab('home')}>
          <ClubLogo className="h-12 w-12 group-hover:scale-105 transition-transform duration-300" />
          <div className="flex flex-col">
            <span className={`font-serif font-bold text-xl tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{CLUB_INFO.name}</span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-600 font-bold mt-0.5">Ujjain</span>
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {['home', 'resources', 'events', 'gallery'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 uppercase tracking-wider ${
                activeTab === tab 
                  ? 'bg-amber-600 text-white shadow-md transform scale-105' 
                  : isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-amber-400' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              {tab}
            </button>
          ))}
          
          {isAdmin ? (
             <button
              onClick={() => setActiveTab('admin')}
              className={`ml-4 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors border ${
                activeTab === 'admin' 
                  ? 'bg-red-600 text-white border-red-600 shadow-md' 
                  : 'border-red-200 text-red-500 hover:bg-red-50'
              }`}
            >
              <Lock className="h-3 w-3" /> Admin
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className={`ml-3 p-2 transition-colors rounded-full ${isDarkMode ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}
              title="Admin Login"
            >
              <UserCircle className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'}`}
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Menu */}
    {mobileMenuOpen && (
      <div className={`md:hidden border-t shadow-xl absolute w-full ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-100'}`}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          {['home', 'resources', 'events', 'gallery'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
              className={`block w-full text-left px-4 py-3 rounded-xl text-base font-bold uppercase tracking-wider transition-colors ${
                isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-amber-400' : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              {tab}
            </button>
          ))}
          <button
              onClick={() => { 
                if(isAdmin) setActiveTab('admin');
                else setShowLogin(true);
                setMobileMenuOpen(false); 
              }}
              className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-red-500 hover:bg-red-50 uppercase tracking-wider mt-4 border border-transparent hover:border-red-100"
            >
              {isAdmin ? "Admin Dashboard" : "Admin Login"}
          </button>
        </div>
      </div>
    )}
  </nav>
);

// --- HERO SECTION WITH DYNAMIC THEME SUPPORT ---
const HeroSection = ({ setActiveTab, isDarkMode, toggleTheme, themeData }) => {
  // Default spiritual image if none set in admin
  const defaultBg = "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";
  const bgImage = themeData?.heroImage ? getOptimizedImageUrl(themeData.heroImage) : defaultBg;

  return (
    <div className={`relative pt-20 pb-24 border-b transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-slate-700' : 'bg-gradient-to-b from-sky-50 to-white border-amber-100'}`}>
      
      {/* Dynamic Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={bgImage} 
          alt="Theme Background" 
          className="w-full h-full object-cover opacity-20 scale-105 animate-pulse-slow"
        />
        {/* Gradient Overlay to ensure text readability */}
        <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-slate-900 via-slate-900/90 to-transparent' : 'from-white via-white/80 to-transparent'}`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Theme Toggle */}
        <div className="mx-auto mb-8 flex justify-center">
           <div 
              onClick={toggleTheme}
              className={`p-4 rounded-full shadow-lg border cursor-pointer transition-all hover:scale-110 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-white border-amber-100 text-amber-500'}`}
              title="Toggle Theme"
           >
              {isDarkMode ? <Moon className="h-12 w-12 animate-pulse-slow" /> : <Sun className="h-12 w-12 animate-pulse-slow" />}
           </div>
        </div>

        {/* Seasonal Greeting (If Active) */}
        {themeData?.seasonalMsg && (
          <div className="inline-block mb-6 animate-bounce">
            <span className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold tracking-widest text-sm uppercase shadow-lg">
              {themeData.seasonalMsg}
            </span>
          </div>
        )}

        <h1 className={`text-4xl md:text-6xl font-bold mb-6 font-serif tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Engineering Excellence. <br/>
          <span className="text-amber-600 italic">Spiritual Grounding.</span>
        </h1>
        
        <p className={`text-lg md:text-xl mb-10 max-w-4xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          The purpose of this club is to create a holistic platform that fosters both <span className="font-semibold text-indigo-500">technical excellence</span> and <span className="font-semibold text-indigo-500">spiritual well-being</span> among students.
        </p>

        <p className={`text-base mb-10 max-w-3xl mx-auto italic ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          "By combining the power of technology with timeless spiritual values, we believe that developing inner clarity, focus, and ethical grounding is just as important as building technical knowledge in today’s competitive world."
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setActiveTab('resources')}
            className="px-8 py-3 bg-indigo-700 text-white text-base font-bold rounded-full shadow-lg hover:bg-indigo-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="h-5 w-5" /> Study Materials
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-8 py-3 border-2 text-base font-bold rounded-full shadow-sm hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-slate-800 text-amber-400 border-slate-700 hover:border-amber-500' : 'bg-white text-amber-700 border-amber-100 hover:border-amber-300 hover:bg-amber-50'}`}
          >
            <Calendar className="h-5 w-5" /> Upcoming Events
          </button>
        </div>
      </div>
    </div>
  );
};

// ... QuoteSection, ObjectivesSection, UniversityTicker ... (Keep same as previous)
const QuoteSection = ({ quotes, isDarkMode }) => (
  <div className={`py-16 border-t border-b ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-amber-50/30 border-amber-100'}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-8">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h2 className={`text-2xl font-bold font-serif ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          Wisdom Wall
        </h2>
        <Sparkles className="h-5 w-5 text-amber-500" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotes && quotes.length > 0 ? quotes.map((q) => (
          <div key={q.id} className={`p-8 rounded-xl border relative flex flex-col justify-center min-h-[200px] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-amber-100'} shadow-sm hover:shadow-md transition-all group`}>
            <Quote className={`absolute top-4 left-4 h-8 w-8 ${isDarkMode ? 'text-slate-700' : 'text-amber-100'} group-hover:text-amber-200 transition-colors`} />
            <p className={`text-lg font-medium italic mb-4 relative z-10 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>"{q.text}"</p>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-amber-400' : 'text-indigo-600'}`}>— {q.author}</p>
          </div>
        )) : (
          <div className="col-span-full text-center text-slate-500 italic py-10">
            "Real education means to know the self." <br/><span className="text-xs font-bold mt-2 block">- Default Wisdom</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ObjectivesSection = ({ isDarkMode }) => {
  const objectives = [
    {
      title: "Technical Development",
      icon: <Cpu className="h-8 w-8 text-indigo-600" />,
      color: isDarkMode ? "bg-slate-800 border-slate-700" : "bg-indigo-50 border-indigo-100",
      points: [
        "Organize workshops, coding events, & seminars",
        "Promote innovation & peer-to-peer mentoring",
        "Conduct study marathons for 1st-year students"
      ]
    },
    {
      title: "Spiritual Growth & Well-being",
      icon: <Sun className="h-8 w-8 text-amber-600" />,
      color: isDarkMode ? "bg-slate-800 border-slate-700" : "bg-amber-50 border-amber-100",
      points: [
        "Guided meditation sessions & value-based living",
        "Host talks by spiritual thinkers & leaders",
        "Celebrate India’s cultural & spiritual heritage"
      ]
    },
    {
      title: "Community & Leadership",
      icon: <HeartHandshake className="h-8 w-8 text-emerald-600" />,
      color: isDarkMode ? "bg-slate-800 border-slate-700" : "bg-emerald-50 border-emerald-100",
      points: [
        "Encourage volunteering & social responsibility",
        "Promote collaboration among departments",
        "Bridge academic gaps through mentorship"
      ]
    }
  ];

  return (
    <div className={`py-20 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold font-serif mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Objectives of Inspire Club</h2>
          <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {objectives.map((obj, idx) => (
            <div key={idx} className={`p-8 rounded-2xl border ${obj.color} hover:shadow-xl transition-all duration-300 group`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                {obj.icon}
              </div>
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{obj.title}</h3>
              <ul className="space-y-3">
                {obj.points.map((point, i) => (
                  <li key={i} className={`flex items-start gap-3 text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDarkMode ? 'bg-slate-500' : 'bg-slate-400'}`} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UniversityTicker = ({ isDarkMode }) => {
  const institutes = [
    { name: "IIT Bombay", icon: "https://upload.wikimedia.org/wikipedia/en/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg" },
    { name: "IIT Delhi", icon: "https://upload.wikimedia.org/wikipedia/en/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg" },
    { name: "IIT Madras", icon: "https://upload.wikimedia.org/wikipedia/en/6/69/IIT_Madras_Logo.svg" },
    { name: "IIT Kharagpur", icon: "https://upload.wikimedia.org/wikipedia/en/1/1c/IIT_Kharagpur_Logo.svg" },
    { name: "NIT Trichy", icon: "https://upload.wikimedia.org/wikipedia/en/4/48/NIT_Trichy_Logo.png" },
    { name: "NIT Warangal", icon: "https://upload.wikimedia.org/wikipedia/en/9/98/NIT_Warangal_Logo.png" },
    { name: "BITS Pilani", icon: "https://upload.wikimedia.org/wikipedia/en/d/d3/BITS_Pilani-Logo.svg" },
    { name: "IIT Indore", icon: "https://upload.wikimedia.org/wikipedia/en/c/c4/IIT_Indore_logo.png" }
  ];

  return (
    <div className={`py-16 border-t transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className={`text-center text-xs font-bold uppercase tracking-[0.2em] mb-10 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Mentored by Professionals from Top Institutes</p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 grayscale hover:grayscale-0 transition-all duration-500">
          {institutes.map((inst, i) => (
            <img 
              key={i} 
              src={inst.icon} 
              alt={inst.name} 
              title={inst.name}
              className={`h-12 w-auto object-contain hover:scale-110 transition-transform ${isDarkMode ? 'opacity-60 hover:opacity-100 brightness-150' : 'opacity-70 hover:opacity-100'}`} 
              onError={(e) => e.target.style.display = 'none'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HomeGalleryPreview = ({ galleryImages, isDarkMode }) => (
  <div className={`py-16 border-t transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-amber-50'}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className={`text-2xl font-bold font-serif mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Gallery Highlights</h2>
        <div className="h-1 w-16 bg-amber-500 mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImages.slice(0, 4).map((img) => (
           <div key={img.id} className="relative group overflow-hidden rounded-xl aspect-square shadow-md">
             <img 
               src={getOptimizedImageUrl(img.url)} 
               alt="Gallery Preview" 
               className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
               onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/400?text=Inspire+Club"}}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacit
// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBhMLyPLJ8s0P56uXlIqIFcbjvL3Am5TJg",
  authDomain: "flutter-ai-playground-452d7.firebaseapp.com",
  projectId: "flutter-ai-playground-452d7",
  storageBucket: "flutter-ai-playground-452d7.firebasestorage.app",
  messagingSenderId: "761849874992",
  appId: "1:761849874992:web:7e4c1f553c07fca1e53bf5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Unique ID for your club's data in the database
const APP_ID = 'inspire-club-uec-prod'; 

// --- DATA CONSTANTS ---

const CLUB_INFO = {
  name: "INSPIRE CLUB UEC",
  tagline: "Culture. Education. Leadership.",
  logo: "https://drive.google.com/file/d/1q7J6ZAX1yOaNQhBl1oonhlxXfpBQlwxj/view?usp=sharing", 
  heroDescription: "A nationwide network of doctors, engineers, and entrepreneurs dedicated to training modern youth in principle-centered living and leadership.",
  stats: [
    { label: "Centers", value: "70+" },
    { label: "Institutes", value: "100+" },
    { label: "Active Members", value: "5000+" }
  ]
};

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const BRANCHES_YR1 = ["Group A (CSE/ECE/EE)", "Group B (CM/CE/ME)"];
const BRANCHES_SENIOR = ["CSE", "ECE", "EE", "ME", "CE", "CM"];

// Helper to get branches for a specific semester
const getBranchesForSemester = (sem) => {
  return sem <= 2 ? BRANCHES_YR1 : BRANCHES_SENIOR;
};

// --- HELPER FUNCTIONS ---

const getOptimizedImageUrl = (url) => {
  if (!url) return '';
  let fileId = null;
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) fileId = fileMatch[1];
  
  if (!fileId) {
     const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
     if (idMatch && idMatch[1]) fileId = idMatch[1];
  }

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
  }
  return url;
};

// --- SUB-COMPONENTS ---

const ClubLogo = ({ className }) => (
  <div className={`relative overflow-hidden rounded-full flex items-center justify-center bg-white shadow-md ${className}`}>
    <img 
      src={getOptimizedImageUrl(CLUB_INFO.logo)} 
      alt="Inspire Club Logo" 
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.parentElement.classList.add('bg-gradient-to-br', 'from-amber-400', 'to-orange-500');
        e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
      }}
    />
  </div>
);

const Navbar = ({ activeTab, setActiveTab, isAdmin, setShowLogin, mobileMenuOpen, setMobileMenuOpen }) => (
  <nav className="bg-indigo-950 text-white sticky top-0 z-50 shadow-xl border-b border-amber-600/30 backdrop-blur-md bg-indigo-950/90">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
          <ClubLogo className="h-10 w-10 md:h-12 md:w-12 group-hover:scale-105 transition-transform duration-300 ring-2 ring-amber-500/50" />
          <div className="flex flex-col">
            <span className="font-bold text-lg md:text-2xl tracking-tight leading-none text-white group-hover:text-amber-400 transition-colors font-serif">{CLUB_INFO.name}</span>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-amber-200/80 font-semibold mt-1">Ujjain</span>
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
          {['home', 'resources', 'events', 'gallery'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 overflow-hidden group tracking-wide ${
                activeTab === tab 
                  ? 'text-indigo-950' 
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              <span className={`absolute inset-0 w-full h-full bg-gradient-to-r from-amber-400 to-orange-500 transform transition-transform duration-300 ${activeTab === tab ? 'scale-100' : 'scale-0 group-hover:scale-100'}`} />
              <span className="relative z-10">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
          
          {isAdmin ? (
             <button
              onClick={() => setActiveTab('admin')}
              className={`ml-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors border-2 ${
                activeTab === 'admin' 
                  ? 'bg-red-600 border-red-600 text-white' 
                  : 'border-red-500/50 text-red-400 hover:bg-red-950 hover:text-white'
              }`}
            >
              <Lock className="h-4 w-4" /> Admin
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="ml-2 p-2 text-indigo-300 hover:text-amber-400 transition-colors"
            >
              <Lock className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-amber-200 hover:text-white hover:bg-indigo-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Menu */}
    {mobileMenuOpen && (
      <div className="md:hidden bg-indigo-950 border-t border-amber-900/30">
        <div className="px-4 pt-4 pb-6 space-y-2">
          {['home', 'resources', 'events', 'gallery'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-lg text-base font-bold text-amber-100 hover:bg-indigo-900 hover:text-amber-400 transition-colors uppercase tracking-wider"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button
              onClick={() => { 
                if(isAdmin) setActiveTab('admin');
                else setShowLogin(true);
                setMobileMenuOpen(false); 
              }}
              className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-300 hover:bg-indigo-900 hover:text-red-400"
            >
              {isAdmin ? "Admin Dashboard" : "Admin Login"}
          </button>
        </div>
      </div>
    )}
  </nav>
);

const Hero = ({ setActiveTab }) => (
  <div className="relative bg-slate-900 overflow-hidden min-h-[700px] flex items-center justify-center">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
        alt="Spiritual Gathering" 
        className="w-full h-full object-cover opacity-20 scale-105 animate-pulse-slow"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-transparent to-amber-900/20" />
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
      
      {/* Gen Z + Spiritual Badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-amber-500/30 text-amber-300 mb-8 animate-fade-in-up hover:bg-white/10 transition-colors cursor-default">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-shadow-sm">High Thinking • Simple Living</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 drop-shadow-2xl">
        <span className="block mb-2 font-serif tracking-normal">{CLUB_INFO.name}</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 font-sans italic text-4xl md:text-6xl">
          Engineering the Soul
        </span>
      </h1>
      
      <p className="mt-6 text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
        Join a revolution of consciousness. We are a network of <span className="text-amber-300 font-semibold">engineers, doctors & entrepreneurs</span> bridging the gap between modern technology and timeless Vedic wisdom.
      </p>
      
      <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto">
        <button 
          onClick={() => setActiveTab('resources')}
          className="w-full sm:w-auto group relative px-8 py-4 bg-white text-indigo-950 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Explore Wisdom <BookOpen className="h-5 w-5 text-indigo-600 group-hover:rotate-12 transition-transform" />
          </span>
        </button>
        
        <button 
          onClick={() => setActiveTab('events')}
          className="w-full sm:w-auto group relative px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Join the Tribe <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </span>
        </button>
      </div>

      <div className="mt-12 text-indigo-300/60 text-sm font-mono tracking-widest uppercase">
        Inspired by A.C. Bhaktivedanta Swami Prabhupada
      </div>
    </div>
  </div>
);

const UniversityTicker = () => {
  const universities = [
    { name: "Cambridge", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg/800px-Coat_of_Arms_of_the_University_of_Cambridge.svg.png" },
    { name: "Oxford", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Arms_of_the_University_of_Oxford.svg/800px-Arms_of_the_University_of_Oxford.svg.png" },
    { name: "Stanford", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Seal_of_Leland_Stanford_Junior_University.svg/800px-Seal_of_Leland_Stanford_Junior_University.svg.png" },
    { name: "Boston", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Boston_University_seal.svg/800px-Boston_University_seal.svg.png" },
    { name: "Harvard", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_shield.svg/800px-Harvard_University_shield.svg.png" }
  ];

  return (
    <div className="bg-white py-12 border-b border-gray-100 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-10">Global Academic Footprint</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {universities.map((uni, idx) => (
            <div key={idx} className="group flex flex-col items-center gap-4 cursor-default">
               <div className="h-16 w-16 md:h-20 md:w-20 relative transition-all duration-500 filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110">
                 <img 
                   src={uni.icon} 
                   alt={uni.name} 
                   className="h-full w-full object-contain drop-shadow-sm" 
                   onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/150?text=${uni.name[0]}`; }} 
                 />
               </div>
               <span className="font-serif text-sm text-gray-400 font-bold group-hover:text-indigo-900 transition-colors opacity-0 group-hover:opacity-100 -mt-2">{uni.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WisdomSection = () => (
  <div className="py-16 bg-amber-50/50 border-y border-amber-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2">Daily Dose</h2>
        <p className="text-2xl font-bold text-indigo-950 font-serif">Vedantic Hacks for the Modern Mind</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Mind Control", desc: "Your mind can be your best friend or your worst enemy. Learn to master it before it masters you.", icon: <Zap className="h-5 w-5"/> },
          { title: "Time & Karma", desc: "Time is the most valuable resource. Invest it in actions that upgrade your consciousness, not just your career.", icon: <Clock className="h-5 w-5"/> },
          { title: "Real Happiness", desc: "Sensual pleasure is temporary. Spiritual satisfaction is eternal. Choose wisely where you seek joy.", icon: <Heart className="h-5 w-5"/> }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow hover:border-amber-300 group">
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              {item.icon}
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AboutSection = () => (
  <div className="py-24 bg-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-50 to-transparent opacity-50" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div>
            <h2 className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-indigo-600"></span> Who We Are
            </h2>
            <p className="text-4xl font-extrabold text-indigo-950 leading-tight font-serif">
              Connecting Science <br/>
              <span className="text-amber-600 italic">with Spirituality</span>
            </p>
          </div>
          
          <div className="prose prose-lg text-gray-600">
            <p className="leading-relaxed">
              <strong>INSPIRE Club UEC</strong> acts as a bridge. We are a community where <span className="font-semibold text-indigo-700">technology meets transcendence</span>. Our nationwide network includes mentors from IITs, NITs, and top global universities who believe that real success involves character competence.
            </p>
            <p className="leading-relaxed">
              We offer systematic seminars on <span className="bg-amber-100 text-amber-800 px-1 rounded">Art of Mind Control</span>, <span className="bg-amber-100 text-amber-800 px-1 rounded">Time Management</span>, and <span className="bg-amber-100 text-amber-800 px-1 rounded">Positive Thinking</span>, helping you become a self-manager and a proactive leader.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
             <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200">Personality Development</div>
             <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200">Public Speaking</div>
             <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200">Team Playing</div>
             <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200">Character Build Up</div>
          </div>

          <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl" />
            <p className="text-xs font-bold opacity-70 mb-3 uppercase tracking-wider">Mentorship Network Includes</p>
            <div className="flex flex-wrap gap-2 text-xs md:text-sm font-medium">
              {['IIT Kharagpur', 'IIT Mumbai', 'IIT Indore', 'BITS Pilani', 'NIT Surathkal', 'MANIT Bhopal', 'NIT Warangal', 'IT BHU', 'SGSITS'].map((inst, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-amber-400 rounded-full"></span> {inst}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative">
           <div className="relative bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 font-serif">Our Impact</h3>
                <p className="text-gray-500 text-sm mt-1">Transforming lives across Ujjain & beyond.</p>
              </div>
              
              <div className="space-y-4">
                {CLUB_INFO.stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                    <span className="text-gray-600 font-medium flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${idx === 0 ? 'bg-blue-100 text-blue-600' : idx === 1 ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                        {idx === 0 ? <MapPin className="h-5 w-5"/> : idx === 1 ? <Landmark className="h-5 w-5"/> : <Users className="h-5 w-5"/>}
                      </div>
                      {stat.label}
                    </span>
                    <span className="text-2xl font-black text-indigo-900 group-hover:scale-110 transition-transform">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                 <div className="flex items-start gap-4">
                    <Quote className="h-8 w-8 text-amber-400 flex-shrink-0" />
                    <p className="text-sm text-gray-600 italic">
                      "Education without character is like a flower without fragrance. We strive to give that fragrance to modern education."
                    </p>
                 </div>
              </div>
           </div>
           
           <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-amber-100 rounded-[2rem] transform rotate-3" />
        </div>
      </div>
    </div>
  </div>
);

const ResourcesSection = ({ resourcesData, activeSemester, setActiveSemester }) => {
  const [activeBranch, setActiveBranch] = useState(getBranchesForSemester(activeSemester)[0]);

  useEffect(() => {
    const branches = getBranchesForSemester(activeSemester);
    if (!branches.includes(activeBranch)) {
      setActiveBranch(branches[0]);
    }
  }, [activeSemester]);

  const semData = resourcesData[activeSemester] || {};
  const branchData = semData[activeBranch] || { subjects: [], sections: {} };
  const sections = branchData.sections || {};

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-indigo-950 text-white py-20 mb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-950 opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-4 font-serif">
            <div className="p-3 bg-amber-500 rounded-xl text-indigo-900 shadow-lg">
              <BookOpen className="h-8 w-8" />
            </div>
            Academic Vault
          </h1>
          <p className="mt-4 text-indigo-200 text-lg max-w-2xl font-light">
            Curated resources for the focused mind. Select your Semester and Branch to find tailored materials.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto pb-6 mb-4 gap-3 hide-scrollbar">
          {SEMESTERS.map((sem) => (
            <button
              key={sem}
              onClick={() => setActiveSemester(sem)}
              className={`flex-shrink-0 px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                activeSemester === sem
                  ? 'bg-amber-500 text-white shadow-amber-200 transform scale-105'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Semester {sem}
            </button>
          ))}
        </div>

        <div className="mb-8">
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Select Branch/Group</h3>
           <div className="flex flex-wrap gap-2">
             {getBranchesForSemester(activeSemester).map(branch => (
               <button
                 key={branch}
                 onClick={() => setActiveBranch(branch)}
                 className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-all ${
                   activeBranch === branch
                     ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                     : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                 }`}
               >
                 {branch}
               </button>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-500" /> Subjects Allocated
              </h3>
              <div className="flex flex-wrap gap-3">
                {branchData.subjects && branchData.subjects.length > 0 ? (
                  branchData.subjects.map((sub, idx) => (
                    <span key={idx} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold border border-indigo-100">
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">No subjects listed for {activeBranch}.</span>
                )}
              </div>
            </div>

            {Object.entries(sections).map(([sectionName, files]) => (
                sectionName !== 'Videos' && (
                  <div key={sectionName} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                        {sectionName.toLowerCase().includes('paper') ? <FileText className="h-5 w-5 text-amber-600"/> : <FolderPlus className="h-5 w-5 text-emerald-600" />}
                        {sectionName}
                      </h3>
                      <span className="text-xs font-bold px-3 py-1 bg-gray-200 text-gray-700 rounded-full">
                        {files.length} Files
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {files.length > 0 ? (
                        files.map((file) => (
                          <div key={file.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${sectionName.toLowerCase().includes('paper') ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                                <FileText className={`h-5 w-5 ${sectionName.toLowerCase().includes('paper') ? 'text-amber-600' : 'text-emerald-600'}`} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{file.title}</p>
                                <p className="text-xs text-gray-400 mt-1">Resource</p>
                              </div>
                            </div>
                            <a href={file.link} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-300 transition-all">
                              <Download className="h-5 w-5" />
                            </a>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400">
                          <p className="text-sm">No files in this section yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-bold text-gray-900">Video Lectures</h3>
              </div>
              <div className="p-5 space-y-6">
                {sections['Videos'] && sections['Videos'].length > 0 ? (
                  sections['Videos'].map((video, idx) => (
                    <div key={video.id} className="group cursor-pointer">
                      <div className="aspect-video bg-gray-900 rounded-xl mb-3 relative overflow-hidden shadow-md group-hover:shadow-lg transition-all">
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="w-0 h-0 border-t-6 border-t-transparent border-l-[10px] border-l-red-600 border-b-6 border-b-transparent ml-1"></div>
                          </div>
                        </div>
                        <div className={`w-full h-full opacity-80 bg-gradient-to-br ${idx % 2 === 0 ? 'from-indigo-800 to-purple-800' : 'from-slate-800 to-gray-800'}`}></div>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-red-600 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{video.channel || 'Video Link'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-8 italic">No video recommendations.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsSection = ({ events }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
    <div className="text-center mb-16">
      <span className="text-amber-600 font-bold uppercase tracking-wider text-sm">Join the Movement</span>
      <h2 className="text-4xl font-extrabold text-indigo-950 mt-2 font-serif">Activities & Workshops</h2>
    </div>

    <div className="mb-20">
      <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3 border-l-4 border-amber-500 pl-4">
        Upcoming Events
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {events && events.upcoming ? events.upcoming.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl shadow-lg shadow-indigo-100 overflow-hidden border border-gray-100 hover:border-amber-200 transition-all flex flex-col sm:flex-row group">
            <div className="bg-indigo-900 p-8 flex flex-col items-center justify-center text-white min-w-[140px] group-hover:bg-amber-500 transition-colors duration-500">
              <span className="text-4xl font-black">{event.date.split(' ')[1].replace(',','')}</span>
              <span className="text-sm font-bold uppercase tracking-widest">{event.date.split(' ')[0]}</span>
            </div>
            <div className="p-8 flex-1">
              <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-3 ${
                event.type === 'Tech' ? 'bg-indigo-100 text-indigo-700' : 
                event.type === 'Spiritual' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {event.type}
              </span>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span>{event.location}</span>
                </div>
              </div>
              <button className="mt-6 w-full sm:w-auto px-6 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-900 hover:text-white transition-all text-sm">
                Register Interest
              </button>
            </div>
          </div>
        )) : <div className="text-gray-500">No upcoming events available.</div>}
      </div>
    </div>

    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3 border-l-4 border-gray-300 pl-4">
        Past Highlights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events && events.past ? events.past.map((event, idx) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all">
            <div className="h-56 bg-gray-200 relative overflow-hidden">
              <img 
                 src={`https://source.unsplash.com/random/800x600?tech,seminar,students,${idx}`} 
                 onError={(e) => {e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}}
                 alt={event.title}
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter saturate-75 group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold border-2 border-white px-4 py-2 rounded-lg">View Album</span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-lg text-gray-900">{event.title}</h4>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <Calendar className="h-3 w-3" /> {event.date}
              </p>
            </div>
          </div>
        )) : <div className="text-gray-500">No past events found.</div>}
      </div>
    </div>
  </div>
);

const GallerySection = ({ galleryImages }) => (
  <div className="bg-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-indigo-950 font-serif">Moments of Inspiration</h2>
        <p className="text-gray-500 mt-2">Glimpses from our Ujjain Center</p>
      </div>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {galleryImages && galleryImages.length > 0 ? galleryImages.map((img) => (
          <div key={img.id} className="break-inside-avoid rounded-xl overflow-hidden group relative cursor-pointer">
            <img 
              src={getOptimizedImageUrl(img.url)}
              alt="Club Gallery" 
              className="w-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/400x300?text=Image+Not+Loaded"}}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )) : <p className="text-gray-500 text-center">No images in gallery.</p>}
      </div>
    </div>
  </div>
);

const AdminDashboard = ({ 
  events, 
  setEvents, 
  resourcesData, 
  setResourcesData, 
  galleryImages,
  setGalleryImages,
  handleLogout, 
  semesters 
}) => {
  const [adminView, setAdminView] = useState('events');
  const [selectedSem, setSelectedSem] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES_YR1[0]);

  // Update selected branch when semester changes
  useEffect(() => {
    const branches = getBranchesForSemester(selectedSem);
    if (!branches.includes(selectedBranch)) {
      setSelectedBranch(branches[0]);
    }
  }, [selectedSem]);

  // --- SAVE TO FIRESTORE FUNCTIONS (Updated paths) ---
  const saveEventsToFirebase = async (newEvents) => {
    try {
      // Corrected Path: 6 segments
      await setDoc(doc(db, "artifacts", APP_ID, "public", "data", "events", "content"), newEvents);
    } catch (e) {
      console.error("Error saving events: ", e);
    }
  };

  const saveResourcesToFirebase = async (newData) => {
    try {
      // Corrected Path: 6 segments
      await setDoc(doc(db, "artifacts", APP_ID, "public", "data", "resources", "content"), { data: newData });
    } catch (e) {
      console.error("Error saving resources: ", e);
    }
  };

  const saveGalleryToFirebase = async (newGallery) => {
    try {
      // Corrected Path: 6 segments
      await setDoc(doc(db, "artifacts", APP_ID, "public", "data", "gallery", "content"), { images: newGallery });
    } catch (e) {
      console.error("Error saving gallery: ", e);
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
      id: Date.now(),
      title: formData.get('title'),
      date: formData.get('date'),
      location: formData.get('location'),
      type: formData.get('type')
    };
    
    // Ensure safe access to upcoming array
    const updatedEvents = {
      ...events,
      upcoming: [...(events?.upcoming || []), newEvent]
    };
    
    setEvents(updatedEvents);
    await saveEventsToFirebase(updatedEvents);
    e.target.reset();
  };

  const deleteEvent = async (type, id) => {
    const updatedEvents = {
      ...events,
      [type]: (events?.[type] || []).filter(e => e.id !== id)
    };
    setEvents(updatedEvents);
    await saveEventsToFirebase(updatedEvents);
  };

  const addResource = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const type = formData.get('type');
    const customType = formData.get('customType');
    const sectionKey = type === 'custom' ? customType : type;

    const newItem = {
      id: Date.now(),
      title: formData.get('title'),
      link: formData.get('link'),
      ...(type === 'Videos' ? { channel: formData.get('channel') } : {})
    };

    const newData = { ...resourcesData };
    if (!newData[selectedSem]) newData[selectedSem] = {};
    if (!newData[selectedSem][selectedBranch]) newData[selectedSem][selectedBranch] = { subjects: [], sections: {} };
    if (!newData[selectedSem][selectedBranch].sections) newData[selectedSem][selectedBranch].sections = {};
    if (!newData[selectedSem][selectedBranch].sections[sectionKey]) newData[selectedSem][selectedBranch].sections[sectionKey] = [];
    
    newData[selectedSem][selectedBranch].sections[sectionKey].push(newItem);
    
    setResourcesData(newData);
    await saveResourcesToFirebase(newData);
    e.target.reset();
  };

  const addSubject = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subject = formData.get('subject');
    
    const newData = { ...resourcesData };
    if (!newData[selectedSem]) newData[selectedSem] = {};
    if (!newData[selectedSem][selectedBranch]) newData[selectedSem][selectedBranch] = { subjects: [], sections: {} };
    
    if(!newData[selectedSem][selectedBranch].subjects.includes(subject)){
       newData[selectedSem][selectedBranch].subjects.push(subject);
    }
    
    setResourcesData(newData);
    await saveResourcesToFirebase(newData);
    e.target.reset();
  };

  const deleteResource = async (sectionKey, id) => {
    const newData = { ...resourcesData };
    newData[selectedSem][selectedBranch].sections[sectionKey] = newData[selectedSem][selectedBranch].sections[sectionKey].filter(item => item.id !== id);
    setResourcesData(newData);
    await saveResourcesToFirebase(newData);
  };

  const addGalleryImage = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newImage = {
      id: Date.now(),
      url: formData.get('url')
    };
    const updatedGallery = [newImage, ...(galleryImages || [])];
    setGalleryImages(updatedGallery);
    await saveGalleryToFirebase(updatedGallery);
    e.target.reset();
  };

  const deleteGalleryImage = async (id) => {
    const updatedGallery = (galleryImages || []).filter(img => img.id !== id);
    setGalleryImages(updatedGallery);
    await saveGalleryToFirebase(updatedGallery);
  };

  const currentBranchData = resourcesData?.[selectedSem]?.[selectedBranch] || { subjects: [], sections: {} };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-indigo-900 text-white p-6 rounded-xl shadow-lg">
          <div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-indigo-200">Inspire Club Management System</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="text-sm bg-indigo-800 px-3 py-1 rounded-full">{CLUB_INFO.stats[0].value} Members</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <button 
              onClick={() => setAdminView('events')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${adminView === 'events' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Calendar className="h-5 w-5" /> Manage Events
            </button>
            <button 
              onClick={() => setAdminView('resources')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${adminView === 'resources' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <FileText className="h-5 w-5" /> Manage Resources
            </button>
            <button 
              onClick={() => setAdminView('gallery')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${adminView === 'gallery' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Camera className="h-5 w-5" /> Manage Gallery
            </button>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            
            {/* --- EVENTS MANAGEMENT --- */}
            {adminView === 'events' && (
              <div className="space-y-6">
                {/* Add Event Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <Plus className="h-5 w-5 text-indigo-600" /> Add New Event
                  </h3>
                  <form onSubmit={addEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="title" required placeholder="Event Title" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
                    <input name="date" required placeholder="Date (e.g. Oct 15, 2025)" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
                    <input name="location" required placeholder="Location" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
                    <select name="type" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full bg-white">
                      <option value="Tech">Tech</option>
                      <option value="Spiritual">Spiritual</option>
                      <option value="Educational">Educational</option>
                    </select>
                    <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 shadow-md font-medium">Create Event</button>
                  </form>
                </div>

                {/* List Events */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Current Upcoming Events</h3>
                  <div className="space-y-3">
                    {events?.upcoming?.length > 0 ? events.upcoming.map(event => (
                      <div key={event.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                        <div>
                          <h4 className="font-semibold text-indigo-900">{event.title}</h4>
                          <p className="text-sm text-gray-500">{event.date} • {event.location} • <span className="text-amber-600">{event.type}</span></p>
                        </div>
                        <button onClick={() => deleteEvent('upcoming', event.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )) : <p className="text-gray-500 italic">No upcoming events found.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* --- RESOURCES MANAGEMENT --- */}
            {adminView === 'resources' && (
              <div className="space-y-6">
                {/* Selectors */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col sm:flex-row items-center gap-4">
                        <span className="font-semibold text-gray-700 whitespace-nowrap w-32">Semester:</span>
                        <div className="flex gap-2 overflow-x-auto w-full pb-2 hide-scrollbar">
                          {semesters.map(sem => (
                            <button 
                              key={sem} 
                              onClick={() => setSelectedSem(sem)}
                              className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold transition-all ${selectedSem === sem ? 'bg-indigo-600 text-white shadow-md scale-110' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                              {sem}
                            </button>
                          ))}
                        </div>
                     </div>
                     <div className="flex flex-col sm:flex-row items-center gap-4">
                        <span className="font-semibold text-gray-700 whitespace-nowrap w-32">Branch:</span>
                        <div className="flex flex-wrap gap-2 w-full">
                           {getBranchesForSemester(selectedSem).map(branch => (
                              <button
                                key={branch}
                                onClick={() => setSelectedBranch(branch)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                                  selectedBranch === branch
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                {branch}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>

                {/* Add Subject */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Add Subject to {selectedBranch}</h3>
                   <form onSubmit={addSubject} className="flex gap-4">
                      <input name="subject" required placeholder="Subject Name" className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add</button>
                   </form>
                   <div className="mt-4 flex flex-wrap gap-2">
                      {currentBranchData.subjects && currentBranchData.subjects.map((sub, i) => (
                         <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border">{sub}</span>
                      ))}
                   </div>
                </div>

                {/* Add Resource Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <Plus className="h-5 w-5 text-indigo-600" /> Add Resource File
                  </h3>
                  <form onSubmit={addResource} className="grid grid-cols-1 gap-4">
                    <ResourceFormFields />
                    <button type="submit" className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 shadow-md font-medium">Add Resource</button>
                  </form>
                </div>

                {/* List Resources */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Existing Files ({selectedBranch})</h3>
                  {currentBranchData.sections ? Object.entries(currentBranchData.sections).map(([sectionName, files]) => (
                    <div key={sectionName} className="mb-6">
                      <h4 className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        {sectionName}
                      </h4>
                      <div className="space-y-2">
                        {files.length > 0 ? files.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                               <span className="font-medium text-gray-800 block">{item.title}</span>
                               <a href={item.link} target="_blank" className="text-xs text-blue-500 hover:underline overflow-hidden text-ellipsis block max-w-[200px]">{item.link}</a>
                            </div>
                            <button onClick={() => deleteResource(sectionName, item.id)} className="text-red-500 hover:text-red-700 p-1">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )) : <p className="text-sm text-gray-400 italic pl-2">No files.</p>}
                      </div>
                    </div>
                  )) : <p className="text-gray-500 italic">No sections created yet.</p>}
                </div>
              </div>
            )}

            {/* --- GALLERY MANAGEMENT --- */}
            {adminView === 'gallery' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <Plus className="h-5 w-5 text-indigo-600" /> Add Gallery Image
                  </h3>
                  <form onSubmit={addGalleryImage} className="flex gap-4">
                    <input name="url" required placeholder="Image URL (e.g., https://...)" className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-medium">Add</button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <h3 className="text-lg font-bold text-gray-800 mb-4">Current Gallery</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {galleryImages && galleryImages.length > 0 ? galleryImages.map(img => (
                        <div key={img.id} className="relative group">
                           <img src={getOptimizedImageUrl(img.url)} className="w-full h-32 object-cover rounded-lg" alt="Gallery" />
                           <button 
                             onClick={() => deleteGalleryImage(img.id)}
                             className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                      )) : <p className="text-gray-500">No images.</p>}
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component to manage complex form state for creating resources
const ResourceFormFields = () => {
   const [type, setType] = useState('Class Notes');

   return (
      <>
         <select 
            name="type" 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full bg-white"
         >
            <option value="Class Notes">Class Notes</option>
            <option value="MST Papers">MST Papers</option>
            <option value="Videos">Videos</option>
            <option value="custom">Create New Section...</option>
         </select>
         
         {type === 'custom' && (
            <input name="customType" required placeholder="New Section Name (e.g. Lab Manuals)" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
         )}

         <input name="title" required placeholder="Title (e.g. Physics MST 1)" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
         <input name="link" required placeholder="Link URL" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
         <input name="channel" placeholder="Channel Name (Only for Videos)" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
      </>
   );
};


const LoginModal = ({ setShowLogin, handleLogin, loginCredentials, setLoginCredentials, loginError }) => (
  <div className="fixed inset-0 bg-indigo-900/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-amber-500" />
      <button 
        onClick={() => setShowLogin(false)} 
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="text-center mb-8">
        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Lock className="h-10 w-10 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
        <p className="text-gray-500 text-sm mt-1">Authorized personnel only.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            value={loginCredentials.username}
            onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})}
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            value={loginCredentials.password}
            onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
            placeholder="••••••"
          />
        </div>
        {loginError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">{loginError}</div>}
        <button 
          type="submit" 
          className="w-full bg-indigo-900 text-white py-3 rounded-lg font-bold hover:bg-indigo-800 transition-all shadow-lg mt-2"
        >
          Secure Login
        </button>
      </form>
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-indigo-950 text-indigo-200 py-16 border-t border-indigo-900 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-500 p-2 rounded-lg text-indigo-900">
             <Zap className="h-6 w-6" fill="currentColor" />
          </div>
          <span className="font-bold text-2xl text-white">{CLUB_INFO.name}</span>
        </div>
        <p className="text-indigo-300 max-w-sm leading-relaxed">
          {CLUB_INFO.heroDescription}
        </p>
        <div className="flex gap-4 mt-8">
          <Instagram className="h-6 w-6 hover:text-amber-500 cursor-pointer transition-colors" />
          <Linkedin className="h-6 w-6 hover:text-amber-500 cursor-pointer transition-colors" />
          <Mail className="h-6 w-6 hover:text-amber-500 cursor-pointer transition-colors" />
        </div>
      </div>
      
      <div>
        <h3 className="text-white font-bold mb-6 text-lg">Navigation</h3>
        <ul className="space-y-3">
          {['Home', 'Events', 'Study Material', 'Gallery'].map(item => (
            <li key={item} className="hover:text-amber-400 cursor-pointer transition-colors">{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-white font-bold mb-6 text-lg">Contact Us</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-amber-500 mt-1" /> 
            <span>inspire@college.edu</span>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-amber-500 mt-1" /> 
            <span>Inspire Club HQ<br/>Ujjain Campus</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-indigo-900 text-center text-sm text-indigo-400">
      © 2025 {CLUB_INFO.name}. Engineering the Future with Values.
    </div>
  </footer>
);

// --- MAIN COMPONENT ---

const ClubWebsite = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Resource View State
  const [activeSemester, setActiveSemester] = useState(1);

  // --- INITIAL STATE LOADING ---
  // We initialize with empty arrays and let useEffect populate them from Firebase
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [galleryImages, setGalleryImages] = useState([]);
  const [resourcesData, setResourcesData] = useState({});

  // --- FIREBASE SYNC HOOKS ---

  // 1. Auth & Initial Load
  useEffect(() => {
    // Sign in anonymously to read/write without forced login UI
    signInAnonymously(auth).catch((error) => console.error("Auth Error:", error));
  }, []);

  // 2. Events Listener (UPDATED PATH: 6 segments)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "artifacts", APP_ID, "public", "data", "events", "content"), (docSnap) => {
      if (docSnap.exists()) {
        setEvents(docSnap.data());
      } else {
        // Seed default events if they don't exist
        const defaultEvents = {
          upcoming: [
            { id: 1, title: "Tech & Consciousness Hackathon", date: "Oct 15, 2025", location: "Main Auditorium, Ujjain", type: "Tech" },
            { id: 2, title: "Meditation for Engineers", date: "Oct 22, 2025", location: "Yoga Hall, Ujjain", type: "Spiritual" },
          ],
          past: [
            { id: 3, title: "Freshers' Orientation", date: "Aug 10, 2025" },
            { id: 4, title: "Robotics & Ethics Expo", date: "July 05, 2025" },
          ]
        };
        setEvents(defaultEvents);
        // Correct path for saving default
        setDoc(doc(db, "artifacts", APP_ID, "public", "data", "events", "content"), defaultEvents);
      }
    });
    return () => unsub();
  }, []);

  // 3. Gallery Listener (UPDATED PATH: 6 segments)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "artifacts", APP_ID, "public", "data", "gallery", "content"), (docSnap) => {
      if (docSnap.exists()) {
        setGalleryImages(docSnap.data().images || []);
      } else {
        // Seed default gallery
        const defaultGallery = [
          { id: 1, url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
          { id: 2, url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
          { id: 3, url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
          { id: 4, url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
          { id: 5, url: "https://images.unsplash.com/photo-1605218427368-35b8095d3e23?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
          { id: 6, url: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
        ];
        setGalleryImages(defaultGallery);
        setDoc(doc(db, "artifacts", APP_ID, "public", "data", "gallery", "content"), { images: defaultGallery });
      }
    });
    return () => unsub();
  }, []);

  // 4. Resources Listener (UPDATED PATH: 6 segments)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "artifacts", APP_ID, "public", "data", "resources", "content"), (docSnap) => {
      if (docSnap.exists()) {
        setResourcesData(docSnap.data().data || {});
      } else {
        // Seed default resources data
        const initialData = {};
        SEMESTERS.forEach(sem => {
            initialData[sem] = {};
            getBranchesForSemester(sem).forEach(branch => {
              initialData[sem][branch] = {
                  subjects: [],
                  sections: {
                    'Class Notes': [],
                    'MST Papers': [],
                    'Videos': []
                  }
              };
            });
        });
        initialData[1]["Group A (CSE/ECE/EE)"].subjects = ["Engineering Physics", "Mathematics I", "Basic Electrical"];
        initialData[1]["Group A (CSE/ECE/EE)"].sections['MST Papers'].push({ id: 101, title: "Physics MST 1 - 2024", link: "#" });
        initialData[1]["Group A (CSE/ECE/EE)"].sections['Videos'].push({ id: 201, title: "Integration Basics", channel: "MathWizard", link: "#" });
        
        setResourcesData(initialData);
        setDoc(doc(db, "artifacts", APP_ID, "public", "data", "resources", "content"), { data: initialData });
      }
    });
    return () => unsub();
  }, []);


  // Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    // Updated Credentials
    if (loginCredentials.username === 'shivesh211204@gmail.com' && loginCredentials.password === 'GudiyA@143') {
      setIsAdmin(true);
      setShowLogin(false);
      setActiveTab('admin');
      setLoginError('');
      setLoginCredentials({ username: '', password: '' });
    } else {
      setLoginError('Invalid credentials.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveTab('home');
  };

  return (
    <div className="font-sans text-gray-900 min-h-screen flex flex-col bg-slate-50">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin} 
        setShowLogin={setShowLogin}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      {showLogin && (
        <LoginModal 
          setShowLogin={setShowLogin}
          handleLogin={handleLogin}
          loginCredentials={loginCredentials}
          setLoginCredentials={setLoginCredentials}
          loginError={loginError}
        />
      )}
      
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <Hero setActiveTab={setActiveTab} />
            <UniversityTicker />
            <WisdomSection />
            <AboutSection />
            <div className="bg-indigo-900 text-center py-12">
              <h3 className="text-2xl font-bold mb-6 text-white">Witness the Journey</h3>
              <div className="flex justify-center gap-4 overflow-hidden h-40 opacity-50 mb-8 px-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-64 bg-slate-800 rounded-lg shrink-0 overflow-hidden relative">
                     <img src={`https://source.unsplash.com/random/400x300?event,${i}`} className="w-full h-full object-cover grayscale" alt="Club life"/>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('gallery')}
                className="text-amber-400 font-bold hover:text-white transition-colors border-b-2 border-amber-500 pb-1"
              >
                Open Full Gallery &rarr;
              </button>
            </div>
          </>
        )}

        {/* Fixed Resources Section Rendering */}
        {activeTab === 'resources' && (
          <ResourcesSection 
            resourcesData={resourcesData}
            activeSemester={activeSemester} 
            setActiveSemester={setActiveSemester} 
          />
        )}

        {activeTab === 'events' && <EventsSection events={events} />}
        {activeTab === 'gallery' && <GallerySection galleryImages={galleryImages} />}
        
        {activeTab === 'admin' && (
          isAdmin ? (
            <AdminDashboard 
              events={events} 
              setEvents={setEvents}
              resourcesData={resourcesData}
              setResourcesData={setResourcesData}
              galleryImages={galleryImages}
              setGalleryImages={setGalleryImages}
              handleLogout={handleLogout}
              semesters={SEMESTERS}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-600">Access Restricted</h2>
                <button onClick={() => setShowLogin(true)} className="mt-4 text-indigo-600 font-semibold hover:underline">Log in here</button>
              </div>
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ClubWebsite;
