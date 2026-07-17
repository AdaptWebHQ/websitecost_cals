'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { ArrowRight, AlertTriangle, Lightbulb, LightbulbOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import dynamic from 'next/dynamic';

const FlowCanvas = dynamic(() => import('@/components/shared/flow-canvas'), {
  ssr: false,
});


/* ─────────────────────────────────────────────
   Shared: Google G icon
───────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58Z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   DESKTOP layout (≥ 980 px) — Cogie split-screen
───────────────────────────────────────────── */
function DesktopLogin({ isLoading, authError, error, onGoogle }: { isLoading: boolean; authError: string | null; error: string | null; onGoogle: () => void }) {
  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 20px' }}>
      <style>{`@keyframes _spin{to{transform:rotate(360deg)}} @media(max-width:980px){.lg-art{display:none!important}}`}</style>
      <div style={{ width: '100%', maxWidth: 1500, height: 'min(88vh,1000px)', borderRadius: 28, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', boxShadow: '0 40px 100px rgba(0,0,0,0.55),0 0 0 1px rgba(255,255,255,0.06)', background: '#fff' }}>

        {/* Left art */}
        <div className="lg-art" style={{ position: 'relative', background: '#050203', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 52px' }}>
          <FlowCanvas />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.15) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 60%,rgba(0,0,0,.55) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2, color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12.5, letterSpacing: '0.16em', fontWeight: 600, color: 'rgba(255,255,255,.92)' }}>
              <span>ADAPTWEB</span>
              <span style={{ height: 1, width: 64, background: 'rgba(255,255,255,.55)' }} />
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 2, color: '#fff' }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: 'clamp(38px,4.4vw,58px)', lineHeight: 1.04, letterSpacing: '-0.01em', marginBottom: 20, textShadow: '0 2px 24px rgba(0,0,0,.35)' }}>
              Get Everything<br />You Want
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,.78)', maxWidth: 380, fontWeight: 400 }}>
              You can get everything you want if you work hard, trust the process, and stick to the plan.
            </p>
          </div>
        </div>

        {/* Right form */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 64px 40px', overflowY: 'auto', background: '#fff' }}>

          {/* Center form */}
          <div style={{ flex: 1, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 34 }}>
              {/* Logo mark */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e7e6e2', overflow: 'hidden' }}>
                  <Image src="/uploaded_logo.png" width={52} height={52} alt="Logo" style={{ objectFit: 'contain' }} />
                </div>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: 40, letterSpacing: '-0.01em', color: '#0b0b0d', marginBottom: 10 }}>Welcome Back</h2>
              <p style={{ fontSize: 14.5, color: '#6b6b70', fontWeight: 400, maxWidth: 300, margin: '0 auto', lineHeight: 1.5 }}>
                Sign in with your Google account to continue to AdaptWeb
              </p>
            </div>

            {(authError || error) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(200,0,0,.06)', border: '1px solid rgba(200,0,0,.18)', color: '#c00', fontSize: 13.5, padding: '12px 16px', borderRadius: 12, marginBottom: 20 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" /><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                {authError || error}
              </div>
            )}

            <button onClick={onGoogle} disabled={isLoading}
              style={{ width: '100%', height: 54, borderRadius: 12, border: '1px solid #e7e6e2', background: '#fff', color: '#0b0b0d', fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: isLoading ? 0.6 : 1, transition: 'all .15s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fafafa'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.99)'; }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >
              {isLoading ? <div style={{ width: 20, height: 20, border: '2px solid #ccc', borderTopColor: '#555', borderRadius: '50%', animation: '_spin .7s linear infinite' }} /> : <><GoogleIcon />Continue with Google</>}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 22, fontSize: 12.5, color: '#6b6b70' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.6" /></svg>
              Secure sign-in, no password required
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: 13.5, color: '#6b6b70', marginTop: 36 }}>
            New to AdaptWeb? Signing in with Google{' '}
            <Link
              href="/register"
              style={{ color: '#0b0b0d', fontWeight: 600, textDecoration: 'none' }}
            >
              creates your account
            </Link>{' '}
            automatically
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOBILE layout (< 980 px) — original lamp card
───────────────────────────────────────────── */
function MobileLogin({ isLoading, authError, error, onGoogle }: { isLoading: boolean; authError: string | null; error: string | null; onGoogle: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLightOn, setIsLightOn] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => { const t = setTimeout(() => setIsLightOn(true), 600); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    let animId: number;
    function syncSize() { if (!canvas) return; const w = canvas.clientWidth || window.innerWidth; const h = canvas.clientHeight || window.innerHeight; if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; } }
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null; ro?.observe(canvas); syncSize();
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null; if (!gl) return;
    const vs = `attribute vec2 a_position;varying vec2 v_texCoord;void main(){v_texCoord=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
    const fs = `precision highp float;uniform float u_time;uniform vec2 u_resolution;varying vec2 v_texCoord;void main(){vec2 uv=v_texCoord;float noise=sin(uv.x*10.+u_time*.5)*cos(uv.y*10.+u_time*.3)*.5+.5;vec3 c1=vec3(.02,.03,.05);vec3 c2=vec3(.05,.07,.12);vec3 c=mix(c1,c2,noise*.2+uv.y*.1);float v=1.-length(uv-.5)*1.2;c*=smoothstep(0.,1.,v);gl_FragColor=vec4(c,1.);}`;
    function mkS(t: number, src: string) { const s = gl!.createShader(t)!; gl!.shaderSource(s, src); gl!.compileShader(s); return s; }
    const p = gl.createProgram()!; gl.attachShader(p, mkS(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mkS(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); gl.useProgram(p);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(p, 'a_position'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(p, 'u_time'); const uR = gl.getUniformLocation(p, 'u_resolution');
    function render(t: number) { if (!canvas || !gl) return; if (typeof ResizeObserver === 'undefined') syncSize(); gl.viewport(0,0,canvas.width,canvas.height); if (uT) gl.uniform1f(uT,t*.001); if (uR) gl.uniform2f(uR,canvas.width,canvas.height); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); animId=requestAnimationFrame(render); }
    render(0);
    return () => { cancelAnimationFrame(animId); ro?.disconnect(); };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center text-[#e4e2e4] overflow-y-auto overflow-x-hidden transition-colors duration-1000 font-sans pb-12"
      style={{ backgroundColor: isLightOn ? '#131315' : '#050505' }}
      onMouseMove={e => { if (!isLightOn) return; setRotateY((window.innerWidth/2-e.clientX)/50); setRotateX(-(window.innerHeight/2-e.clientY)/50); }}
      onMouseLeave={() => { setRotateY(0); setRotateX(0); }}
    >
      <div className="fixed inset-0 pointer-events-none transition-opacity duration-1000" style={{ opacity: isLightOn ? 0.4 : 0 }}>
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] pointer-events-none transition-opacity duration-1000" style={{ background: 'radial-gradient(circle at 50% 0%,rgba(255,180,50,.15) 0%,transparent 60%)', opacity: isLightOn ? 1 : 0 }} />

      <div className="relative flex flex-col items-center z-50 shrink-0">
        <div className="w-[2px] h-[120px]" style={{ background: 'linear-gradient(to bottom,transparent,#222)' }} />
        <button onClick={() => setIsLightOn(!isLightOn)} className="group relative flex flex-col items-center cursor-pointer focus:outline-none">
          <div className="w-12 h-6 bg-[#1a1a1a] rounded-t-full border border-white/5" />
          <div className={`w-8 h-8 rounded-full border border-white/10 -mt-1 flex items-center justify-center transition-all duration-700 ${isLightOn ? 'bg-[#fff6e5] scale-110 shadow-[0_0_40px_rgba(255,200,100,.8),0_0_100px_rgba(255,200,100,.4)]' : 'bg-[#111] hover:scale-105'}`}>
            {isLightOn ? <Lightbulb className="w-4 h-4 text-[#ffcc00]" /> : <LightbulbOff className="w-4 h-4 text-orange-200/20 group-hover:text-orange-200/40" />}
          </div>
          <span className="absolute -bottom-8 whitespace-nowrap font-mono text-[12px] uppercase tracking-[.1em] pointer-events-none text-[#e4e2e4]" style={{ opacity: isLightOn ? 0 : 0.4 }}>Click to awaken</span>
        </button>
      </div>

      <main className="relative z-10 w-full max-w-[420px] px-4 md:px-0 mt-16 shrink-0">
        <AnimatePresence>
          {isLightOn && (
            <motion.div initial={{ opacity: 0, y: 20, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1, rotateX, rotateY }} exit={{ opacity: 0, y: 20, scale: .95 }} transition={{ type: 'spring', stiffness: 300, damping: 30, rotateX: { type: 'tween', ease: 'linear', duration: .1 }, rotateY: { type: 'tween', ease: 'linear', duration: .1 } }}
              className="rounded-xl p-8 md:p-10 flex flex-col gap-8" style={{ backdropFilter: 'blur(40px)', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,.5)', perspective: '1000px' }}>
              <header className="flex flex-col items-center text-center space-y-4">
                <div style={{ width: 72, height: 72, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                  <Image src="/uploaded_logo.png" width={52} height={52} alt="Logo" style={{ objectFit: 'contain' }} />
                </div>
                <div className="space-y-1">
                  <h1 className="text-[32px] font-bold text-[#e4e2e4] leading-tight tracking-tight">Welcome Back</h1>
                  <p className="text-[16px] text-[#c6c6cd]">Sign in to your account to continue</p>
                </div>
              </header>
              {(authError || error) && (
                <div className="flex items-center gap-3 bg-[#93000a]/20 border border-[#ffb4ab]/20 p-4 rounded-lg">
                  <AlertTriangle className="text-[#ffb4ab] w-5 h-5 shrink-0" />
                  <p className="text-[#ffb4ab] text-sm">{authError || error}</p>
                </div>
              )}
              <button onClick={onGoogle} disabled={isLoading} className="w-full bg-white text-[#07006c] h-14 rounded-full flex items-center justify-center gap-3 font-semibold group transition-all duration-300 hover:bg-opacity-90 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <div className="w-5 h-5 border-2 border-[#07006c]/30 border-t-[#07006c] rounded-full animate-spin" /> : <><GoogleIcon /><span>Continue with Google</span><ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" /></>}
              </button>
              <footer className="text-center">
                <div className="w-full pt-6 border-t border-white/5">
                  <p className="font-mono text-[10px] text-[#c6c6cd] tracking-widest uppercase opacity-40">Built by AdaptWeb</p>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Responsive shell
───────────────────────────────────────────── */
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginWithGoogle, isLoading, error, setError } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => { setError(null); }, [setError]);
  useEffect(() => { if (user) router.push(searchParams.get('redirect') || '/dashboard'); }, [user, router, searchParams]);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 980px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleGoogle = async () => {
    setAuthError(null);
    const res = await loginWithGoogle();
    if (!res.success) setAuthError(res.error || 'Authentication failed. Please try again.');
  };

  const props = { isLoading, authError, error, onGoogle: handleGoogle };
  return isDesktop ? <DesktopLogin {...props} /> : <MobileLogin {...props} />;
}

export default function LoginClient() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,.15)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
