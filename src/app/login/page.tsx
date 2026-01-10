
"use client";
import { useState, useEffect, ChangeEvent, FocusEvent } from "react";
import Loader from "@/components/Loader";
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
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({});
  
  const router = useRouter();

  // Clear session and local storage on mount to reduce confusion
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    console.log("Auth storage cleared on mount");
  }, []);

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
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Invalid email address";
    }
    if (name === "password" && value.length < 6) {
      error = "Password must be at least 6 characters";
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
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Provided API URL uses query params: http://.../FetchUser?Username=...&Password=...
        const url = `${API_CONFIG.LOGIN_URL}?Username=${encodeURIComponent(form.email)}&Password=${encodeURIComponent(form.password)}`;
        
        console.log("Calling Login API:", url);
        const response = await fetch(url);
        const data = await response.json();
        
        console.log("Login API Response:", data);
        
        // Note: Check actual success condition from the API. assuming response.ok or success flag.
        if (response.ok) {
           // Save personality details to sessionStorage
           if (data.Data && data.Data.User_Personality_Details) {
             sessionStorage.setItem("userPersonality", JSON.stringify(data.Data.User_Personality_Details));
           }
           
           alert("Login successful! Welcome back.");
           router.push(API_CONFIG.HOME_ROUTE);
        } else {
           alert("Login failed: " + (data.message || "Invalid credentials"));
        }
      } else {
        // Registration: Store credentials for SaveUser API call later
        const pendingUser = {
          username: form.email, // Using email as username
          password: form.password
        };
        localStorage.setItem("pendingUser", JSON.stringify(pendingUser));
        
        alert("Account created successfully! Let's build your AI personality profile.");
        router.push(API_CONFIG.PERSONALITY_PORTAL_ROUTE);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert("Authentication error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid =
    Object.values(errors).every((e) => !e) &&
    (isLogin || Object.values(form).every(Boolean));

  return (
    <div className="min-h-screen app-theme-bg flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
        {/* Floating Particles Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div className="floating-particle w-32 h-32 bg-purple-500/20 rounded-full blur-3xl absolute -top-10 -left-10 animate-float" />
           <div className="floating-particle w-40 h-40 bg-pink-500/20 rounded-full blur-3xl absolute bottom-0 right-0 animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10">
            <div className="text-center mb-8">
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
                        setForm({ ...form, name: e.target.value });
                        if (touched.name) validateField("name", e.target.value);
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
                setForm({ ...form, email: e.target.value });
                if (touched.email) validateField("email", e.target.value);
                }}
                error={touched.email && errors.email ? errors.email : undefined}
            />

            <Input
                label="Password"
                type="password"
                value={form.password}
                onBlur={() => handleBlur("password")}
                onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (touched.password) validateField("password", e.target.value);
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
                        onChange={(e) => setForm({ ...form, zodiac: e.target.value })}
                        error={touched.zodiac && !form.zodiac ? "Required" : undefined}
                    />
                    <Input
                        label="Birth Date"
                        type="date"
                        value={form.dob}
                        onBlur={() => handleBlur("dob")}
                        onChange={(e) => setForm({ ...form, dob: e.target.value })}
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
                <Loader text={isLogin ? "Logging in..." : "Creating Account..."} size="sm" />
                ) : ( 
                isLogin ? "Login to Dashboard" : "Create Account"
                )}
            </button>
            </form>

            <div className="mt-6 text-center">
            <button
                onClick={() => {
                    setIsLogin(!isLogin);
                    setForm({ name: "", email: "", password: "", zodiac: "", dob: "" });
                    setErrors({});
                    setTouched({});
                }}
                className="text-white hover:text-white/80 font-medium text-sm transition-colors border-b border-white/30 hover:border-white pb-0.5"
            >
                {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, error, ...props }: InputProps) => (
  <div className="flex flex-col gap-1.5 group">
    <label className="text-sm font-semibold text-white ml-1 group-focus-within:text-purple-200 transition-colors">
        {label}
    </label>
    <input
      {...props}
      className={`
        px-4 py-3 rounded-xl bg-white/10 border-2 outline-none text-white placeholder-white/40 transition-all duration-300
        ${error 
            ? "border-red-400 bg-red-500/10 focus:border-red-400" 
            : "border-white/10 focus:border-white/40 focus:bg-white/20 hover:border-white/20"
        }
      `}
    />
    {error && <span className="text-xs text-red-200 font-medium ml-1 bg-red-500/20 px-2 py-0.5 rounded-md inline-block w-fit">{error}</span>}
  </div>
);

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