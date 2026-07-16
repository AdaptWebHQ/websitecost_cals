'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ArrowRight, AlertTriangle, Lightbulb, LightbulbOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginWithGoogle, isLoading, error, setError } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLightOn, setIsLightOn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Auto turn on light after a short delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLightOn(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Clear errors on load
  useEffect(() => {
    setError(null);
  }, [setError]);

  // Handle redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [user, router, searchParams]);

  const handleGoogleSignUp = async () => {
    setAuthError(null);
    const res = await loginWithGoogle(true);
    if (!res.success) {
      setAuthError(res.error || 'Registration failed. Please try again.');
    }
  };

  const toggleLight = () => {
    setIsLightOn(!isLightOn);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isLightOn) return;
    const xAxis = (window.innerWidth / 2 - e.clientX) / 50;
    const yAxis = (window.innerHeight / 2 - e.clientY) / 50;
    setRotateY(xAxis);
    setRotateX(-yAxis);
  };

  const handleMouseLeave = () => {
    if (!isLightOn) return;
    setRotateY(0);
    setRotateX(0);
  };

  // WebGL Shader Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || (canvas as any).getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    
    // Create a smooth, dark ambient noise background
    float noise = sin(uv.x * 10.0 + u_time * 0.5) * cos(uv.y * 10.0 + u_time * 0.3) * 0.5 + 0.5;
    
    // Define base colors from a dark, sophisticated palette - Cool indigo for register
    vec3 color1 = vec3(0.02, 0.015, 0.04); 
    vec3 color2 = vec3(0.06, 0.04, 0.1); 
    
    // Mix based on noise and position
    vec3 finalColor = mix(color1, color2, noise * 0.2 + uv.y * 0.1);
    
    // Add a subtle vignette
    float vignette = 1.0 - length(uv - 0.5) * 1.2;
    finalColor *= smoothstep(0.0, 1.0, vignette);
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;
    function cs(type: number, src: string) {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    const prog = gl.createProgram();
    if (!prog) return;
    const vertexShader = cs(gl.VERTEX_SHADER, vs);
    const fragmentShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    function render(t: number) {
      if (!canvas || !gl) return;
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col items-center text-[#e4e2e4] selection:bg-[#bec6e0] selection:text-[#283044] overflow-y-auto overflow-x-hidden transition-colors duration-1000 font-sans pb-12"
      style={{ backgroundColor: isLightOn ? '#0f0a17' : '#050505' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Full Bleed Shader Background */}
      <div
        className="fixed inset-0 transition-opacity duration-1000 pointer-events-none"
        style={{ opacity: isLightOn ? 0.4 : 0 }}
      >
        <div className="absolute inset-0 w-full h-full block">
          <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
      </div>

      {/* Ambient Glow Layer - Changed to purple/indigo for register */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
          opacity: isLightOn ? 1 : 0
        }}
      />

      {/* The Interactive Lamp Section */}
      <div className="relative flex flex-col items-center z-50 shrink-0">
        <div className="w-[2px] h-[120px] relative" style={{ background: 'linear-gradient(to bottom, transparent, #222)' }} />
        <button
          onClick={toggleLight}
          className="group relative flex flex-col items-center cursor-pointer focus:outline-none transition-all duration-500"
        >
          {/* Lamp Base */}
          <div className="w-12 h-6 bg-[#1a1a1a] rounded-t-full border border-white/5" />

          {/* Interactive Bulb */}
          <div
            className={`w-8 h-8 rounded-full border border-white/10 -mt-1 flex items-center justify-center transition-all duration-700 ${isLightOn ? 'bg-[#f0eaff] scale-110 shadow-[0_0_40px_rgba(139,92,246,0.8),0_0_100px_rgba(139,92,246,0.4)]' : 'bg-[#111] shadow-[0_0_10px_rgba(139,92,246,0.1)] hover:scale-105'
              }`}
          >
            {isLightOn ? (
              <Lightbulb className="w-4 h-4 text-[#a78bfa] opacity-100" />
            ) : (
              <LightbulbOff className="w-4 h-4 text-purple-200/20 group-hover:text-purple-200/40" />
            )}
          </div>

          {/* Subtitle Tip */}
          <span
            className="absolute -bottom-8 whitespace-nowrap font-mono text-[12px] opacity-40 uppercase tracking-[0.1em] pointer-events-none transition-opacity duration-500 text-[#e4e2e4]"
            style={{ opacity: isLightOn ? 0 : 0.4 }}
          >
            Click to awaken
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[420px] px-4 md:px-0 mt-16 shrink-0">
        <AnimatePresence>
          {isLightOn && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95, rotateX: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: rotateX,
                rotateY: rotateY
              }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                rotateX: { type: "tween", ease: "linear", duration: 0.1 },
                rotateY: { type: "tween", ease: "linear", duration: 0.1 }
              }}
              className="rounded-xl p-8 md:p-10 flex flex-col gap-8"
              style={{
                backdropFilter: 'blur(40px)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                perspective: '1000px',
              }}
            >
              {/* Card Header */}
              <header className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border border-[#45464d] shadow-lg overflow-hidden">
                  <img src="/uploaded_logo.png" alt="Adaptweb Logo" className="w-16 h-16 object-contain" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-[32px] font-bold text-[#e4e2e4] leading-tight tracking-tight">Create Account</h1>
                  <p className="text-[16px] text-[#c6c6cd]">Sign up to start your journey</p>
                </div>
              </header>

              {/* Error State */}
              {(authError || error) && (
                <div className="flex items-center gap-3 bg-[#93000a]/20 border border-[#ffb4ab]/20 p-4 rounded-lg">
                  <AlertTriangle className="text-[#ffb4ab] w-5 h-5 shrink-0" />
                  <p className="text-[#ffb4ab] text-sm">{authError || error}</p>
                </div>
              )}

              {/* Primary Actions */}
              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full bg-white text-[#2e1065] h-14 rounded-full flex items-center justify-center gap-3 font-semibold group transition-all duration-300 hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#2e1065]/30 border-t-[#2e1065] rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                      </svg>
                      <span>Sign Up with Google</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Footer Links & Branding */}
              <footer className="text-center flex flex-col items-center">
                <a className="text-[#c6c6cd] text-sm hover:text-[#bec6e0] transition-colors duration-300 group inline-flex items-center gap-1 mb-6" href="/login">
                  Already have an account? <span className="text-[#bec6e0] font-semibold underline underline-offset-4 decoration-[#bec6e0]/30 group-hover:decoration-[#bec6e0]">Sign in</span>
                </a>

                <div className="text-center text-[10px] text-[#c6c6cd]/60 leading-relaxed max-w-[280px] mb-6">
                  By signing up, you agree to our{' '}
                  <a href="/terms" className="underline hover:text-[#c6c6cd]">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="underline hover:text-[#c6c6cd]">
                    Privacy Policy
                  </a>.
                </div>

                <div className="w-full pt-6 border-t border-white/5">
                  <p className="font-mono text-[10px] text-[#c6c6cd] tracking-widest uppercase opacity-40">
                    Built by AdaptWeb
                  </p>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-[#c6c6cd] font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#bec6e0]/20 border-t-[#bec6e0] rounded-full animate-spin" />
          <p className="text-sm font-medium tracking-wide">Loading secure portal...</p>
        </div>
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  );
}
