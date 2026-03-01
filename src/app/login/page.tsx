
"use client";
import { useState, useEffect, ChangeEvent, FocusEvent } from "react";
import Loader from "@/components/Loader";
import Alert from "@/components/Alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/config/constants";

const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

interface FormData {
  name: string;
  email: string;
  password: string;
  zodiac: string;
  dob: string;
}

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onBlur: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  error?: string;
  onBlur: () => void;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function SnapSaysAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const router = useRouter();

  // If already logged in, redirect to home
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (loggedIn) {
      router.replace(API_CONFIG.HOME_ROUTE);
    } else {
      // Clear stale data for a fresh login attempt
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [router]);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    zodiac: "",
    dob: ""
  });

  type TouchedFields = Partial<Record<keyof FormData, boolean>>;

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateField = (name: keyof FormData, value: string) => {
    let error = "";
    if (name === "email") {
      if (!value.trim()) {
        error = "Email address is required";
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        error = "Invalid email address";
      }
    }
    if (name === "password") {
      if (!value.trim()) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }
    if (name === "name" && !isLogin && !value.trim()) {
      error = "Name is required";
    }
    if (name === "dob" && !isLogin && !value) {
      error = "Birth date is required";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (field: keyof FormData) =>
    setTouched({ ...touched, [field]: true });

  const handleSubmit = async () => {
    // Manual validation check before proceeding
    const newErrors: Partial<FormData> = {};
    const newTouched: TouchedFields = { ...touched };

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    newTouched.email = true;

    // Password validation
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    newTouched.password = true;

    if (!isLogin) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.dob) newErrors.dob = "Birth date is required";
      if (!form.zodiac) newErrors.zodiac = "Required";
      newTouched.name = true;
      newTouched.dob = true;
      newTouched.zodiac = true;
    }

    setErrors(newErrors);
    setTouched(newTouched);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Provided API URL uses query params: http://.../FetchUser?Username=...&Password=...
        const url = `${API_CONFIG.LOGIN_URL}?UserName=${encodeURIComponent(form.email)}&Password=${encodeURIComponent(form.password)}`;
        
        console.log("Calling Login API:", url);
        const response = await fetch(url);
        const data = await response.json();
        
        console.log("Login API Response:", data);
        
        // API might return 200 OK but with an error code in the body (e.g., ResponseCode: 500)
        const isSuccess = response.ok && 
                         (data.ResponseCode === 200 || data.ResponseCode === "200") &&
                         data.Data !== null;

        if (isSuccess) {
           // Mark user as logged in
           sessionStorage.setItem("isLoggedIn", "true");

           // Save personality details to sessionStorage
           if (data.Data && data.Data.User_Personality_Details) {
             sessionStorage.setItem("userPersonality", JSON.stringify(data.Data.User_Personality_Details));
           }

           setAlert({ message: "Login successful! Welcome back.", type: 'success' });
           setTimeout(() => router.push(API_CONFIG.HOME_ROUTE), 1500);
        } else {
           // Stay on login page — do NOT redirect on error
           const errorMsg = data.ResponseMessage || data.message || "Invalid credentials or server error. Please try again.";
           setAlert({ message: "Login failed: " + errorMsg, type: 'error' });
        }
      } else {
        // Registration: Store credentials for SaveUser API call later
        const pendingUser = {
          username: form.email, // Using email as username
          password: form.password
        };
        localStorage.setItem("pendingUser", JSON.stringify(pendingUser));
        
        setAlert({ message: "Account created successfully! Let's build your AI personality profile.", type: 'success' });
        setTimeout(() => router.push(API_CONFIG.PERSONALITY_PORTAL_ROUTE), 2000);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setAlert({ message: "Authentication error. Please try again.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const isValid =
    Object.values(errors).every((e) => !e) &&
    form.email.trim().length > 0 &&
    form.password.trim().length > 0 &&
    (isLogin || (form.name.trim().length > 0 && form.dob.length > 0 && form.zodiac.length > 0));

  return (
    <div className="min-h-screen app-theme-bg flex items-center justify-center p-4">
      <Alert 
        message={alert?.message || null} 
        type={alert?.type} 
        onClose={() => setAlert(null)} 
      />
      <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
        {/* Floating Particles Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div className="floating-particle w-32 h-32 bg-purple-500/20 rounded-full blur-3xl absolute -top-10 -left-10 animate-float" />
           <div className="floating-particle w-40 h-40 bg-pink-500/20 rounded-full blur-3xl absolute bottom-0 right-0 animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10">
            <div className="text-center mb-8">
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src="/logoMain.png" 
                  alt="SnapSays Logo" 
                  className="relative w-40 h-40 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg mb-2">
                {isLogin ? "Welcome Back" : "Join SnapSays"}
            </h1>
            <p className="text-white/80 font-medium">
                {isLogin ? "Continue your caption journey" : "Unlock your AI personality"}
            </p>
            </div>

            <form className="space-y-5">
            {!isLogin && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={form.name}
                        onBlur={() => handleBlur("name")}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({ ...form, name: val });
                          validateField("name", val);
                          setTouched(prev => ({ ...prev, name: true }));
                        }}
                        error={touched.name && errors.name ? errors.name : undefined}
                    />
                </div>
            )}

            <Input
                label="Email Address"
                placeholder="hello@example.com"
                type="email"
                value={form.email}
                onBlur={() => handleBlur("email")}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, email: val });
                  validateField("email", val);
                  setTouched(prev => ({ ...prev, email: true }));
                }}
                error={touched.email && errors.email ? errors.email : undefined}
            />

            <Input
                label="Password"
                type="password"
                value={form.password}
                onBlur={() => handleBlur("password")}
                onChange={(e) => {
                    const val = e.target.value;
                    setForm({ ...form, password: val });
                    validateField("password", val);
                    setTouched(prev => ({ ...prev, password: true }));
                }}
                error={touched.password && errors.password ? errors.password : undefined}
            />

            {!isLogin && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
                    <Select
                        label="Zodiac Sign"
                        value={form.zodiac}
                        options={zodiacSigns}
                        onBlur={() => handleBlur("zodiac")}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({ ...form, zodiac: val });
                          setTouched(prev => ({ ...prev, zodiac: true }));
                        }}
                        error={touched.zodiac && !form.zodiac ? "Required" : undefined}
                    />
                    <Input
                        label="Birth Date"
                        type="date"
                        value={form.dob}
                        onBlur={() => handleBlur("dob")}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({ ...form, dob: val });
                          validateField("dob", val);
                          setTouched(prev => ({ ...prev, dob: true }));
                        }}
                        error={touched.dob && !form.dob ? "Required" : undefined}
                    />
                </div>
            )}

            <button
                type="button"
                onClick={handleSubmit} 
                disabled={!isValid || isLoading}
                className="w-full btn-primary mt-6 mb-2 flex justify-center items-center h-12 text-lg font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
                {isLoading ? (
                <Loader text={isLogin ? "Logging in..." : "Creating User..."} size="sm" />
                ) : ( 
                isLogin ? "Login" : "Create User"
                )}
            </button>
            </form>

            <div className="mt-6 text-center relative z-20">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setForm({ name: "", email: "", password: "", zodiac: "", dob: "" });
                  setErrors({});
                  setTouched({});
                }}
                className="text-white font-medium text-sm transition-all hover:cursor-pointer hover:underline pb-0.5"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>

            {/* Social Logins */}
            {/* <div className="mt-8 pt-6 border-white/20">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-xs uppercase tracking-[0.2em] text-white font-bold whitespace-nowrap drop-shadow-sm">Social Login</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>
              
              <div className="flex justify-center gap-6 mb-4">
                <button
                  type="button"
                  className="w-16 h-16 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/30 text-white flex items-center justify-center hover:bg-[#1877F2]/20 hover:scale-110 transition-all cursor-pointer group shadow-lg shadow-[#1877F2]/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>

                <button
                  type="button"
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/20 text-white flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </div>
                </button>

                <button
                  type="button"
                  className="w-16 h-16 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-white flex items-center justify-center hover:bg-[#0A66C2]/20 hover:scale-110 transition-all cursor-pointer group shadow-lg shadow-[#0A66C2]/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#0A66C2"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </button>
              </div>
            </div> */}

            {/* Footer Hint */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-sm text-center text-white font-bold tracking-widest opacity-90 drop-shadow-md">
                  Powered by Artificially Intelligent Team
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}

const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Input = ({ label, error, type, ...props }: InputProps) => {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="text-sm font-semibold text-white ml-1 group-focus-within:text-purple-200 transition-colors">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={isPassword ? (showPwd ? "text" : "password") : type}
          className={`
            w-full px-4 py-3 rounded-xl bg-white/10 border-2 outline-none text-white placeholder-white/40 transition-all duration-300
            ${isPassword ? "pr-12" : ""}
            ${error
              ? "border-red-400 bg-red-500/10 focus:border-red-400"
              : "border-white/10 focus:border-white/40 focus:bg-white/20 hover:border-white/20"
            }
          `}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer focus:outline-none"
            aria-label={showPwd ? "Hide password" : "Show password"}
          >
            {showPwd ? <EyeClosed /> : <EyeOpen />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-200 font-medium ml-1 bg-red-500/20 px-2 py-0.5 rounded-md inline-block w-fit">{error}</span>}
    </div>
  );
};

const Select = ({ label, options, error, ...props }: SelectProps) => (
  <div className="flex flex-col gap-1.5 group">
    <label className="text-sm font-semibold text-white ml-1 group-focus-within:text-purple-200 transition-colors">
        {label}
    </label>
    <div className="relative">
        <select
        {...props}
        className={`
            w-full px-4 py-3 rounded-xl bg-white/10 border-2 outline-none text-white appearance-none transition-all duration-300 cursor-pointer
            ${error 
                ? "border-red-400 bg-red-500/10 focus:border-red-400" 
                : "border-white/10 focus:border-white/40 focus:bg-white/20 hover:border-white/20"
            }
        `}
        >
        <option value="" className="bg-gray-800 text-gray-400">Select...</option>
        {options.map((opt) => (
            <option key={opt} value={opt} className="bg-gray-800 text-white">
            {opt}
            </option>
        ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
    </div>
    {error && <span className="text-xs text-red-200 font-medium ml-1 bg-red-500/20 px-2 py-0.5 rounded-md inline-block w-fit">{error}</span>}
  </div>
);