
"use client";
import { useState, ChangeEvent, FocusEvent } from "react";

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
] as const;

interface FormData {
  name: string;
  dob: string;
  zodiac: string;
  gender: string;
  email: string;
  password: string;
}

interface TouchedFields {
  [key: string]: boolean;
}

interface Errors {
  name: string | false;
  dob: string | false;
  zodiac: string | false;
  gender: string | false;
  email: string | false;
  password: string | false;
}

interface InputProps {
  label: string;
  error?: string | false;
  type?: string;
  value: string;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  max?: string;
  placeholder?: string;
}

interface SelectProps {
  label: string;
  options: readonly string[] | string[];
  error?: string | false;
  value: string;
  onBlur: (e: FocusEvent<HTMLSelectElement>) => void;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function SnapSaysAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [form, setForm] = useState<FormData>({
    name: "",
    dob: "",
    zodiac: "",
    gender: "",
    email: "",
    password: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const errors: Errors = {
    name: !form.name && "Name is required",
    dob: !form.dob && "Date of Birth is required",
    zodiac: !form.zodiac && "Zodiac sign is required",
    gender: !form.gender && "Gender is required",
    email: !/^\S+@\S+\.\S+$/.test(form.email) && "Valid email required",
    password: form.password.length < 6 && "Minimum 6 characters",
  };

  const handleBlur = (field: keyof FormData) =>
    setTouched({ ...touched, [field]: true });

  const isValid =
    Object.values(errors).every((e) => !e) &&
    (isLogin || Object.values(form).every(Boolean));

  return (
    <div className="app-theme-bg flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 page-enter">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">SnapSays ✨</h1>
          <p className="text-white/80 text-lg font-medium">
            {isLogin ? "Welcome Back!" : "Create Your Account"}
          </p>
        </div>

        <form className="space-y-4">
          {!isLogin && (
            <>
              <Input
                label="Name"
                type="text"
                value={form.name}
                placeholder="Enter your name"
                onBlur={() => handleBlur("name")}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={touched.name && errors.name}
              />

              <Input
                label="Date of Birth"
                type="date"
                value={form.dob}
                max={today}
                onBlur={() => handleBlur("dob")}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                error={touched.dob && errors.dob}
              />

              <Select
                label="Zodiac Sign"
                options={zodiacSigns}
                value={form.zodiac}
                onBlur={() => handleBlur("zodiac")}
                onChange={(e) => setForm({ ...form, zodiac: e.target.value })}
                error={touched.zodiac && errors.zodiac}
              />

              <Select
                label="Gender"
                options={["Male", "Female", "Other"]}
                value={form.gender}
                onBlur={() => handleBlur("gender")}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                error={touched.gender && errors.gender}
              />
            </>
          )}

          <Input
            label="Email"
            type="email"
            value={form.email}
            onBlur={() => handleBlur("email")}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={touched.email && errors.email}
          />

          <Input
            label="Password"
            type="password"
            value={form.password}
            onBlur={() => handleBlur("password")}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={touched.password && errors.password}
          />

          <button
            type="button"
            disabled={!isValid}
            className="w-full btn-primary mt-6 mb-2"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-white/90 mt-6">
          {isLogin ? "New to SnapSays?" : "Already a user?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold underline hover:text-white transition"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

/* Reusable Components */
const Input = ({ label, error ,placeholder, ...props }: InputProps) => (
  <div>
    <label className="block text-white/90 font-medium mb-2">{label}</label>
    <input
      {...props}
      placeholder={placeholder}
      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
    {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
  </div>
);

const Select = ({ label, options, error, ...props }: SelectProps) => (
  <div>
    <label className="block text-white/90 font-medium mb-2">{label}</label>
    <select
      {...props}
      className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
    >
      <option value="" className="text-gray-800">
        Select
      </option>
      {options.map((o) => (
        <option key={o} value={o} className="text-gray-800">
          {o}
        </option>
      ))}
    </select>
    {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
  </div>
);