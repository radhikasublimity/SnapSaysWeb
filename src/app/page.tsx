
"use client";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(null);

  const [platform, setPlatform] = useState("Instagram");

  const handleImage = (e:any) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file) as any);
  };

  return (
    <div className="app-theme-bg flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg p-8 hover:scale-[1.01] transition-transform">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
            SnapSays ✨
          </h1>
          <p className="text-white/90 mt-2 text-sm font-medium">
            Turn images into captions using AI-powered vision & language
          </p>
          <a 
            href="/personality-portal" 
            className="inline-block mt-3 text-white hover:text-white/80 font-medium text-sm underline transition-colors"
          >
            Set up your personality profile →
          </a>
        </div>

        {/* Image Upload */}
        <label className="group block cursor-pointer mb-5">
          <div
            className="border-2 border-dashed border-white/40 rounded-xl p-5 text-center bg-white/10 backdrop-blur-sm
                          group-hover:border-white/70 group-hover:bg-white/20 transition-all"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="mx-auto rounded-lg max-h-48 object-contain shadow-lg"
              />
            ) : (
              <>
                <p className="text-white font-medium text-sm">
                  Drop an image or click to upload
                </p>
                <p className="text-xs text-white/70 mt-1">
                  JPG, PNG, WebP supported
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
        </label>

        {/* Platform Selector */}
        <div className="mb-6">
          <p className="text-sm font-medium text-white mb-2">
            Choose your vibe
          </p>
          <div className="flex gap-3">
            {["Instagram", "LinkedIn"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`flex-1 py-2 rounded-full font-semibold transition-all border border-white/20
                  ${
                    platform === p
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105 border-transparent"
                      : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          disabled={!image}
          className="w-full btn-primary
                     hover:shadow-xl hover:shadow-purple-500/40
                     disabled:opacity-50 disabled:cursor-not-allowed
                     animate-pulse"
        >
          Generate Caption 🚀
        </button>

        {/* Footer Hint */}
        <p className="text-xs text-center text-white/60 mt-4">
          Powered by CNNs + LSTMs • Computer Vision meets NLP
        </p>
      </div>
    </div>
  );
}
