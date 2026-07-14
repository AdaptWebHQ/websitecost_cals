const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CONFIG = {
  chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  edgePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  outDir: path.join(__dirname, '..', 'Package-01-Portfolio'),
  publicDir: path.join(__dirname, '..', 'public', 'images', 'package1'),
};

const targets = [
  { id: 'business-card', folder: '01-Business-Card', filename: 'business-card.png', width: 700, height: 400 },
  { id: 'logo', folder: '02-Website-Layers', filename: 'logo.png', width: 180, height: 45 },
  { id: 'navbar', folder: '02-Website-Layers', filename: 'navbar.png', width: 1200, height: 70 },
  { id: 'hero-image', folder: '02-Website-Layers', filename: 'hero-image.png', width: 720, height: 420 },
  { id: 'headline', folder: '02-Website-Layers', filename: 'headline.png', width: 800, height: 140 },
  { id: 'subheading', folder: '02-Website-Layers', filename: 'subheading.png', width: 650, height: 60 },
  { id: 'cta-button', folder: '02-Website-Layers', filename: 'cta-button.png', width: 380, height: 80 },
  { id: 'about-card', folder: '02-Website-Layers', filename: 'about-card.png', width: 460, height: 260 },
  { id: 'project-card-1', folder: '02-Website-Layers', filename: 'project-card-1.png', width: 460, height: 80 },
  { id: 'project-card-2', folder: '02-Website-Layers', filename: 'project-card-2.png', width: 460, height: 80 },
  { id: 'project-card-3', folder: '02-Website-Layers', filename: 'project-card-3.png', width: 460, height: 80 },
  { id: 'skills-section', folder: '02-Website-Layers', filename: 'skills-section.png', width: 460, height: 120 },
  { id: 'contact-section', folder: '02-Website-Layers', filename: 'contact-section.png', width: 460, height: 220 },
  { id: 'footer', folder: '02-Website-Layers', filename: 'footer.png', width: 1200, height: 64 },
  { id: 'feature-panel', folder: '03-Feature-Panel', filename: 'feature-panel.png', width: 400, height: 320 },
  { id: 'calculator-panel', folder: '04-Calculator', filename: 'calculator-panel.png', width: 400, height: 200 },
  { id: 'portfolio-full-ui', folder: '05-Full-Website', filename: 'portfolio-full-ui.png', width: 1920, height: 1080 },
];

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Premium Portfolio Assets Generator</title>
  <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: transparent;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .font-serif-editorial {
      font-family: 'Instrument Serif', serif;
    }
    .font-mono-tag {
      font-family: 'JetBrains Mono', monospace;
    }
    /* Liquid/Glassmorphism helpers */
    .glass-card {
      background: rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(16px);
      border: 1.5px solid rgba(255, 255, 255, 0.65);
      box-shadow: 
        0 4px 30px rgba(0, 0, 0, 0.01),
        0 1px 3px rgba(0, 0, 0, 0.01),
        inset 0 1px 1px rgba(255, 255, 255, 0.85);
    }
    .glass-pill {
      background: rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(9, 9, 11, 0.05);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }
    .glass-card-dark {
      background: rgba(15, 23, 42, 0.04);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(15, 23, 42, 0.05);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }
    .grid-bg {
      background-color: #fafaf8;
      background-image: 
        linear-gradient(to right, rgba(9, 9, 11, 0.018) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(9, 9, 11, 0.018) 1px, transparent 1px);
      background-size: 32px 32px;
    }
    /* Glass business card effects */
    .business-glass {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.08) 100%);
      backdrop-filter: blur(28px);
      border: 1.5px solid rgba(255, 255, 255, 0.55);
      box-shadow: 
        0 25px 50px -12px rgba(15, 23, 42, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.7);
    }
  </style>
</head>
<body>

  <!-- ================= CONTAINER FOR INDIVIDUAL LAYER IMAGES ================= -->
  <div class="p-8 flex flex-col gap-12 bg-slate-900/10">
    <h1 class="text-white text-2xl font-bold font-mono">Individual Asset Components</h1>

    <!-- 1. Premium Glass Business Card -->
    <div id="business-card" class="w-[700px] h-[400px] flex items-center justify-center bg-transparent relative overflow-hidden">
      <!-- Glow blobbies behind card -->
      <div class="absolute w-[180px] h-[180px] rounded-full bg-emerald-500/12 blur-[60px] top-[30%] left-[25%] pointer-events-none"></div>
      <div class="absolute w-[150px] h-[150px] rounded-full bg-teal-500/10 blur-[50px] bottom-[25%] right-[25%] pointer-events-none"></div>
      
      <!-- Card Body -->
      <div class="w-[620px] h-[320px] rounded-2xl business-glass p-8 flex flex-col justify-between relative overflow-hidden">
        <!-- Gloss Reflection Lines -->
        <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rotate-12 -translate-y-24"></div>
        <div class="absolute -right-16 -top-16 w-32 h-32 rounded-full border border-white/10 pointer-events-none"></div>
        
        <!-- Top Row -->
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-full bg-emerald-950/5 border border-emerald-950/10 flex items-center justify-center shadow-xs">
              <!-- Geometric minimal logo -->
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" stroke="#134e3a" stroke-width="2.5" />
                <path d="M12 4V20" stroke="#134e3a" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-semibold tracking-wider text-slate-800 uppercase font-mono-tag">A.CARTER</h2>
              <p class="text-[10px] text-slate-500 font-mono-tag uppercase tracking-widest mt-0.5">EST. 2026</p>
            </div>
          </div>
          <span class="text-[10px] font-medium font-mono-tag text-emerald-800 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Creative Portfolio
          </span>
        </div>

        <!-- Middle Row / Brand Statement -->
        <div class="my-auto">
          <h3 class="text-3xl font-light text-slate-800 tracking-wide font-serif-editorial italic leading-tight">
            Alex Carter
          </h3>
          <p class="text-xs text-slate-600 tracking-wider uppercase font-mono-tag mt-1">
            Creative Designer & Developer
          </p>
        </div>

        <!-- Bottom Row -->
        <div class="flex justify-between items-end border-t border-slate-900/5 pt-4">
          <div class="text-[10px] text-slate-500 font-mono-tag space-y-0.5">
            <p>W: alexcarter.design</p>
            <p>E: hello@alexcarter.design</p>
          </div>
          <div class="text-right">
            <p class="text-[9px] font-bold text-slate-800 uppercase tracking-widest font-mono-tag">Bandra, Mumbai</p>
            <p class="text-[9px] text-slate-500 font-mono-tag">Available for Commission</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Logo -->
    <div id="logo" class="w-[180px] h-[45px] flex items-center justify-start bg-transparent">
      <div class="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="12" r="6" stroke="#0e3a2f" stroke-width="2" />
          <circle cx="14" cy="12" r="6" stroke="#16a34a" stroke-width="2" stroke-dasharray="2 2" />
        </svg>
        <span class="font-bold tracking-widest text-[13px] text-slate-800 uppercase font-mono-tag">A.CARTER</span>
      </div>
    </div>

    <!-- 3. Navbar -->
    <div id="navbar" class="w-[1200px] h-[70px] flex items-center justify-center bg-transparent">
      <div class="w-full h-full rounded-full glass-card px-8 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="12" r="6" stroke="#0e3a2f" stroke-width="2" />
            <circle cx="14" cy="12" r="6" stroke="#16a34a" stroke-width="2" stroke-dasharray="2 2" />
          </svg>
          <span class="font-bold tracking-widest text-xs text-slate-800 uppercase font-mono-tag">A.CARTER</span>
        </div>
        
        <!-- Menu -->
        <div class="flex items-center gap-8 text-[11px] font-medium text-slate-600 tracking-wider uppercase font-mono-tag">
          <a href="#" class="text-slate-900 transition-colors">Home</a>
          <a href="#" class="hover:text-slate-900 transition-colors">About</a>
          <a href="#" class="hover:text-slate-900 transition-colors">Projects</a>
          <a href="#" class="hover:text-slate-900 transition-colors">Contact</a>
        </div>

        <!-- Button -->
        <button class="bg-[#0e3a2f] hover:bg-[#165042] text-white font-mono-tag text-[10px] font-semibold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm transition-all">
          Hire Me
        </button>
      </div>
    </div>

    <!-- 4. Hero Image (Translucent glass workspaces) -->
    <div id="hero-image" class="w-[720px] h-[420px] bg-transparent flex items-center justify-center relative overflow-hidden">
      <!-- Glow background grid inside card frame -->
      <div class="w-[660px] h-[360px] rounded-2xl glass-card relative overflow-hidden flex items-center justify-center p-6">
        <div class="absolute inset-0 opacity-[0.08]" style="background-image: radial-gradient(circle at 1px 1px, #000 1px, transparent 0); background-size: 16px 16px;"></div>
        
        <!-- Decorative abstract shapes (Awwwards/Apple developer style) -->
        <div class="absolute w-[240px] h-[240px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-500/8 to-transparent blur-xl top-6 left-12 pointer-events-none"></div>
        <div class="absolute w-[180px] h-[180px] rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-xl bottom-6 right-12 pointer-events-none"></div>

        <!-- 3D Glass layers mock representation -->
        <div class="relative w-full h-full flex items-center justify-between gap-6 z-10">
          
          <!-- Floating Editorial Layout Box A -->
          <div class="w-1/2 h-full rounded-xl bg-white/40 border border-white/60 p-5 flex flex-col justify-between shadow-xs">
            <div class="flex justify-between items-center text-[8px] font-mono-tag text-slate-400 font-bold">
              <span>DESIGN PHILOSOPHY</span>
              <span>GRID STABILITY</span>
            </div>
            
            <div class="my-4">
              <span class="text-[9px] font-mono-tag text-emerald-800 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                TACTILE INTERACTIONS
              </span>
              <h4 class="text-xl font-light text-slate-800 leading-tight font-serif-editorial italic mt-2.5">
                Balancing raw structure with organic fluid mechanics.
              </h4>
            </div>

            <div class="flex items-center gap-2 border-t border-slate-900/5 pt-3">
              <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span class="text-[8px] font-mono-tag text-slate-500 font-bold uppercase tracking-wider">System Online</span>
            </div>
          </div>

          <!-- Glass Frame B (overlapping grid structure) -->
          <div class="w-1/2 h-full flex flex-col gap-4">
            
            <!-- Mini panel: Project details with dynamic charts/lines -->
            <div class="h-[55%] rounded-xl bg-white/45 border border-white/65 p-4 flex flex-col justify-between shadow-xs">
              <div class="flex justify-between items-start">
                <span class="text-[8px] font-mono-tag text-slate-400 uppercase tracking-widest">Aura Performance</span>
                <span class="text-[10px] text-emerald-700 font-mono-tag font-bold">99.8%</span>
              </div>
              
              <!-- Subtle SVG wave representation -->
              <svg class="w-full h-12 my-2 overflow-visible" viewBox="0 0 200 40">
                <path d="M0,35 C30,25 60,38 90,20 C120,2 150,22 180,8 L200,12" fill="none" stroke="rgba(16, 185, 129, 0.4)" stroke-width="2.5" stroke-linecap="round"></path>
                <circle cx="90" cy="20" r="3.5" fill="#10b981" stroke="#fff" stroke-width="1.5"></circle>
              </svg>
              
              <div class="text-[8px] text-slate-400 font-mono-tag uppercase tracking-wider flex justify-between border-t border-slate-900/5 pt-2">
                <span>01. FRAMEWORK</span>
                <span>NEXT.JS SPEED</span>
              </div>
            </div>

            <!-- Mini panel: Monospace terminal styled preview -->
            <div class="h-[45%] rounded-xl bg-slate-950/5 border border-slate-950/5 p-4 flex flex-col justify-between shadow-inner">
              <div class="flex justify-between items-center text-[7px] font-mono-tag text-slate-400 font-bold">
                <span>RENDER TREE</span>
                <div class="flex gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                </div>
              </div>
              <div class="text-[9px] font-mono-tag text-slate-600 font-bold mt-1 tracking-wider leading-relaxed">
                $ const ui = <span class="text-emerald-700">createDesign</span>({<br>
                &nbsp;&nbsp;theme: <span class="text-emerald-700">'luxury_minimalism'</span><br>
                });
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>

    <!-- 5. Headline -->
    <div id="headline" class="w-[800px] h-[140px] bg-transparent flex items-center justify-start">
      <h2 class="text-5xl font-light text-slate-800 leading-[1.15] tracking-tight font-sans">
        Designing Digital <span class="font-serif-editorial italic text-emerald-800">Experiences</span> That Convert.
      </h2>
    </div>

    <!-- 6. Subheading -->
    <div id="subheading" class="w-[650px] h-[60px] bg-transparent flex items-center justify-start">
      <p class="text-slate-500 font-light text-[13px] leading-relaxed tracking-wide">
        Senior designer creating high-fidelity digital platforms. Focused on raw minimalism, tactile interactions, and functional beauty that elevates brand metrics.
      </p>
    </div>

    <!-- 7. CTA Button -->
    <div id="cta-button" class="w-[380px] h-[80px] bg-transparent flex items-center justify-start">
      <div class="flex items-center gap-4">
        <button class="bg-[#0e3a2f] hover:bg-[#165042] text-white font-mono-tag text-[10px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-full shadow-md transition-all">
          Let's Work Together
        </button>
        <button class="border border-slate-900/10 hover:border-slate-900/20 text-slate-800 font-mono-tag text-[10px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-full transition-all flex items-center gap-1.5">
          View Projects <span>→</span>
        </button>
      </div>
    </div>

    <!-- 8. About Card -->
    <div id="about-card" class="w-[460px] h-[260px] bg-transparent flex items-center justify-center">
      <div class="w-full h-full rounded-2xl glass-card p-6 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-[9px] font-mono-tag text-slate-400 uppercase tracking-widest">About Profile</span>
          <span class="text-[8px] font-mono-tag text-emerald-800 uppercase tracking-wider font-semibold">Available</span>
        </div>
        
        <div class="flex items-start gap-4 my-2">
          <!-- Geometric avatar placeholder -->
          <div class="w-16 h-16 rounded-xl bg-gradient-to-tr from-emerald-950/10 via-emerald-950/5 to-transparent border border-emerald-950/10 flex items-center justify-center shadow-xs shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 18C9.58 18 7.48 16.76 6.3 14.9C6.33 13.01 10.1 11.9 12 11.9C13.89 11.9 17.67 13.01 17.7 14.9C16.52 16.76 14.42 18 12 18Z" fill="#0e3a2f" fill-opacity="0.6"/>
            </svg>
          </div>
          <div>
            <p class="text-slate-600 text-[11px] leading-relaxed tracking-wide font-light">
              I blend logical structure with deep aesthetic emotion to build web environments that feel exceptionally alive. Partnering with design-led teams globally.
            </p>
          </div>
        </div>

        <div class="flex justify-between items-center border-t border-slate-900/5 pt-3 text-[9px] font-mono-tag text-slate-400">
          <span>COORDINATES: 19.0760° N, 72.8777° E</span>
          <span class="text-slate-600 font-bold uppercase">ALEX CARTER</span>
        </div>
      </div>
    </div>

    <!-- 9. Project Card 1 -->
    <div id="project-card-1" class="w-[460px] h-[80px] bg-transparent flex items-center justify-center">
      <div class="w-full h-full rounded-xl glass-card px-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-[10px] font-mono-tag text-slate-400">01</span>
          <div>
            <h4 class="text-xs font-semibold text-slate-800 tracking-wider font-mono-tag">AETHER APP</h4>
            <p class="text-[9px] text-slate-400 font-mono-tag mt-0.5">SaaS Platform UI & Identity</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[8px] font-mono-tag text-emerald-800 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Framer / Next.js</span>
          <div class="w-6 h-6 rounded-full border border-slate-900/5 flex items-center justify-center text-[10px] text-slate-600">↗</div>
        </div>
      </div>
    </div>

    <!-- 10. Project Card 2 -->
    <div id="project-card-2" class="w-[460px] h-[80px] bg-transparent flex items-center justify-center">
      <div class="w-full h-full rounded-xl glass-card px-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-[10px] font-mono-tag text-slate-400">02</span>
          <div>
            <h4 class="text-xs font-semibold text-slate-800 tracking-wider font-mono-tag">NOVA STUDIO</h4>
            <p class="text-[9px] text-slate-400 font-mono-tag mt-0.5">E-Commerce Brand Portal</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[8px] font-mono-tag text-emerald-800 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Figma Design</span>
          <div class="w-6 h-6 rounded-full border border-slate-900/5 flex items-center justify-center text-[10px] text-slate-600">↗</div>
        </div>
      </div>
    </div>

    <!-- 11. Project Card 3 -->
    <div id="project-card-3" class="w-[460px] h-[80px] bg-transparent flex items-center justify-center">
      <div class="w-full h-full rounded-xl glass-card px-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-[10px] font-mono-tag text-slate-400">03</span>
          <div>
            <h4 class="text-xs font-semibold text-slate-800 tracking-wider font-mono-tag">ZENITH BRAND</h4>
            <p class="text-[9px] text-slate-400 font-mono-tag mt-0.5">Art Direction & Photography</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[8px] font-mono-tag text-emerald-800 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Interaction</span>
          <div class="w-6 h-6 rounded-full border border-slate-900/5 flex items-center justify-center text-[10px] text-slate-600">↗</div>
        </div>
      </div>
    </div>

    <!-- 12. Skills Section -->
    <div id="skills-section" class="w-[460px] h-[120px] bg-transparent flex items-center justify-center">
      <div class="w-full h-full rounded-2xl glass-card p-5 flex flex-col justify-between">
        <span class="text-[8px] font-mono-tag text-slate-400 uppercase tracking-widest">Stack & Competence</span>
        
        <div class="flex flex-wrap gap-2 mt-2">
          <span class="glass-pill text-slate-700 font-mono-tag text-[9px] tracking-wider py-1 px-3 rounded-full uppercase">Figma</span>
          <span class="glass-pill text-slate-700 font-mono-tag text-[9px] tracking-wider py-1 px-3 rounded-full uppercase">React</span>
          <span class="glass-pill text-slate-700 font-mono-tag text-[9px] tracking-wider py-1 px-3 rounded-full uppercase">Next.js</span>
          <span class="glass-pill text-slate-700 font-mono-tag text-[9px] tracking-wider py-1 px-3 rounded-full uppercase">TypeScript</span>
          <span class="glass-pill text-slate-700 font-mono-tag text-[9px] tracking-wider py-1 px-3 rounded-full uppercase">Brand Identity</span>
        </div>
      </div>
    </div>

    <!-- 13. Contact Section -->
    <div id="contact-section" class="w-[460px] h-[220px] bg-transparent flex items-center justify-center">
      <div class="w-full h-full rounded-2xl glass-card p-6 flex flex-col justify-between">
        <div>
          <span class="text-[8px] font-mono-tag text-slate-400 uppercase tracking-widest">LET'S COLLABORATE</span>
          <h4 class="text-sm font-semibold tracking-wider text-slate-800 uppercase font-mono-tag mt-1">hello@alexcarter.design</h4>
        </div>
        
        <!-- Tiny Form -->
        <div class="relative mt-2">
          <input type="email" placeholder="Your Email address" class="w-full bg-white/20 border border-slate-900/5 focus:outline-none focus:border-slate-900/20 text-xs font-mono-tag rounded-full py-2.5 pl-4 pr-10 text-slate-800 placeholder-slate-400 shadow-inner">
          <button class="absolute right-1.5 top-1.5 w-6 h-6 rounded-full bg-[#0e3a2f] flex items-center justify-center text-[10px] text-white">↗</button>
        </div>

        <div class="flex justify-between items-center text-[8px] font-mono-tag text-slate-400 border-t border-slate-900/5 pt-3">
          <span>RESPONSES WITHIN 24 HOURS</span>
          <span>Bandra, IN</span>
        </div>
      </div>
    </div>

    <!-- 14. Footer -->
    <div id="footer" class="w-[1200px] h-[64px] bg-transparent flex items-center justify-center">
      <div class="w-full h-full rounded-full glass-card px-8 flex items-center justify-between text-[9px] font-mono-tag text-slate-400">
        <span>© 2026 ALEX CARTER. ADAPTWEB CLIENT PORTFOLIO.</span>
        <div class="flex gap-4">
          <a href="#" class="hover:text-slate-600 transition-colors uppercase">LinkedIn</a>
          <a href="#" class="hover:text-slate-600 transition-colors uppercase">Read.cv</a>
          <a href="#" class="hover:text-slate-600 transition-colors uppercase">Awwwards</a>
        </div>
        <span class="font-bold text-emerald-800 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Single Page Package - ₹4,999
        </span>
      </div>
    </div>

    <!-- 15. Feature Panel (independent) -->
    <div id="feature-panel" class="w-[400px] h-[320px] bg-transparent flex items-center justify-center">
      <div class="w-[360px] h-[280px] rounded-2xl glass-card p-6 flex flex-col justify-between relative overflow-hidden">
        <div class="absolute w-[100px] h-[100px] rounded-full bg-emerald-500/10 blur-[40px] -right-8 -top-8 pointer-events-none"></div>
        <div>
          <span class="text-[8px] font-mono-tag text-emerald-800 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
            Package Deliverables
          </span>
          <h3 class="text-sm font-semibold tracking-wider text-slate-800 uppercase font-mono-tag mt-3.5">
            Single Page Site
          </h3>
        </div>

        <ul class="text-[11px] font-mono-tag text-slate-600 space-y-3.5 my-3">
          <li class="flex items-center gap-2.5">
            <span class="text-emerald-600 font-bold">✓</span> Responsive Design
          </li>
          <li class="flex items-center gap-2.5">
            <span class="text-emerald-600 font-bold">✓</span> SEO Configured & Ready
          </li>
          <li class="flex items-center gap-2.5">
            <span class="text-emerald-600 font-bold">✓</span> Integrated Contact Form
          </li>
          <li class="flex items-center gap-2.5">
            <span class="text-emerald-600 font-bold">✓</span> Optimized Mobile Experience
          </li>
          <li class="flex items-center gap-2.5">
            <span class="text-emerald-600 font-bold">✓</span> Lightning Fast Page Loading
          </li>
        </ul>

        <div class="border-t border-slate-900/5 pt-3.5 text-[8px] font-mono-tag text-slate-400 uppercase tracking-widest">
          ADAPTWEB STANDARDS APPROVED
        </div>
      </div>
    </div>

    <!-- 16. Calculator Panel (independent) -->
    <div id="calculator-panel" class="w-[400px] h-[200px] bg-transparent flex items-center justify-center">
      <div class="w-[360px] h-[160px] rounded-2xl glass-card p-5 flex flex-col justify-between relative overflow-hidden">
        <div class="absolute w-[80px] h-[80px] rounded-full bg-emerald-500/8 blur-[30px] -left-6 -bottom-6 pointer-events-none"></div>
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[8px] font-mono-tag text-slate-400 uppercase tracking-widest">AdaptWeb Estimator</span>
            <h4 class="text-xs font-semibold text-slate-800 tracking-wider uppercase font-mono-tag mt-0.5">Estimated Cost</h4>
          </div>
          <span class="text-[8px] text-emerald-800 font-semibold font-mono-tag bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
            Active
          </span>
        </div>

        <div class="flex items-baseline gap-2 mt-2">
          <span class="text-3xl font-black text-slate-900 tracking-tight font-mono-tag">₹4,999</span>
          <span class="text-[10px] text-slate-400 font-mono-tag uppercase">Single Page Fixed</span>
        </div>

        <div class="flex justify-between items-center border-t border-slate-900/5 pt-3 text-[9px] font-mono-tag text-slate-500">
          <span>NO RUSH FEES APPLIED</span>
          <span class="text-emerald-700 font-bold uppercase">Ready to Build</span>
        </div>
      </div>
    </div>
  </div>

</body>
</html>
`;

// Helper to make target directory if not exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function run() {
  console.log('--- Start Generating Portfolio Assets ---');
  
  // Write HTML to a temp file
  const tempHtmlPath = path.join(__dirname, 'temp-generator.html');
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');
  console.log(`Temporary generator HTML written to: ${tempHtmlPath}`);

  // Setup Directories
  ensureDir(CONFIG.outDir);
  ensureDir(CONFIG.publicDir);
  for (const t of targets) {
    ensureDir(path.join(CONFIG.outDir, t.folder));
  }
  console.log('Target directories verified.');

  // Try Chrome first, then Edge
  let executablePath = CONFIG.chromePath;
  if (!fs.existsSync(executablePath)) {
    console.log(`Chrome not found at: ${executablePath}. Trying Edge...`);
    executablePath = CONFIG.edgePath;
  }

  if (!fs.existsSync(executablePath)) {
    console.error('CRITICAL: Neither Google Chrome nor Microsoft Edge was found on the system path.');
    process.exit(1);
  }

  console.log(`Launching headless browser using: ${executablePath}`);
  
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    console.log(`Loading local HTML page: file://${tempHtmlPath}`);
    await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });

    // Wait for fonts/external resources to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Capture each target
    for (const target of targets) {
      console.log(`Capturing selector: #${target.id} (${target.width}x${target.height} px)`);
      const element = await page.$(`#${target.id}`);
      if (!element) {
        console.error(`Error: Element #${target.id} was not found on the page.`);
        continue;
      }

      // Check if we need full ui (no transparency) or layers (transparent bg)
      const omitBackground = target.id !== 'portfolio-full-ui';

      // Capture screenshot
      const outPath = path.join(CONFIG.outDir, target.folder, target.filename);
      await element.screenshot({
        path: outPath,
        omitBackground,
      });
      console.log(`Saved successfully to: ${outPath}`);

      // Special case: Copy the full website UI mockup to the public dir as requested by the second prompt
      if (target.id === 'portfolio-full-ui') {
        const publicOutPath = path.join(CONFIG.publicDir, target.filename);
        fs.copyFileSync(outPath, publicOutPath);
        console.log(`Copied full website mockup to public directory: ${publicOutPath}`);
      }
    }

    console.log('--- Asset Generation Completed Successfully ---');
  } catch (error) {
    console.error('An error occurred during screenshots capture:', error);
  } finally {
    await browser.close();
    // Clean up temporary HTML
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

run();
