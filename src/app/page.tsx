
"use client";
import { useState } from "react";
import Loader from "@/components/Loader";
import Alert from "@/components/Alert";
import { API_CONFIG } from "@/config/constants";

interface CaptionOption {
  caption: string;
  hashtags: string[];
}

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [platform, setPlatform] = useState("Instagram");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState<CaptionOption[] | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  // Background Replacement States
  const [showRemoveBg, setShowRemoveBg] = useState(false);
  const [bgDescription, setBgDescription] = useState("");
  const [isBgLoading, setIsBgLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file) as any);
    setGeneratedCaption(null); // Reset captions on new image
    setShowRemoveBg(false); // Reset Remove Bg toggle
    setGeneratedImage(null); // Reset generated image
  };

  const addWatermark = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.src = "/favicon.ico";

      const loadImages = Promise.all([
        new Promise((res, rej) => { img.onload = res; img.onerror = rej; }),
        new Promise((res) => { logo.onload = res; logo.onerror = () => res(null); }) // weak fail for logo
      ]);

      loadImages.then(() => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Watermark Configuration
        const text = "SnapSays AI ✨";
        const fontSize = Math.max(20, canvas.width * 0.04);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";

        const padding = fontSize;
        const x = canvas.width - padding;
        const y = canvas.height - padding;

        // Draw Text
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillText(text, x, y);

        // Draw Logo (Favicon)
        // Position logo to the left of the text
        const textMetrics = ctx.measureText(text);
        const logoSize = fontSize * 1.5;
        const logoX = x - textMetrics.width - logoSize - (padding / 2);
        const logoY = y - fontSize + (fontSize - logoSize) / 2; // Align roughly with text center/baseline

        // Draw logo with shadow
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

        resolve(canvas.toDataURL("image/png"));
      }).catch(e => reject(e));
    });
  };

  const handleRemoveBg = async () => {
    if (!image) {
      setAlert({ message: "Please upload an image first!", type: 'warning' });
      return;
    }
    if (!bgDescription.trim()) {
      setAlert({ message: "Please describe what to remove/change!", type: 'warning' });
      return;
    }

    setIsBgLoading(true);
    setGeneratedImage(null);

    const formData = new FormData();
    formData.append("image_file", image);
    formData.append("prompt", bgDescription.trim());

    try {
      const response = await fetch(API_CONFIG.CLIPDROP_CONFIG.URL, {
        method: "POST",
        headers: {
          'x-api-key': API_CONFIG.CLIPDROP_CONFIG.API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        // Try to read error as JSON, fallback to status text
        const errorText = await response.text();
        let errorMessage = `Failed to replace background (${response.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) errorMessage = errorJson.error;
        } catch (e) { /* ignore json parse error */ }

        throw new Error(errorMessage);
      }

      // Clipdrop returns the image binary
      const blob = await response.blob();
      const newImageUrl = URL.createObjectURL(blob);

      // Add Watermark
      const watermarkedImage = await addWatermark(newImageUrl);

      setGeneratedImage(watermarkedImage);
      setAlert({ message: "Background replaced successfully! ✨", type: 'success' });

    } catch (error: any) {
      console.error(error);
      setAlert({ message: `Error: ${error.message}`, type: 'error' });
    } finally {
      setIsBgLoading(false);
    }
  };

  const generateCaption = async () => {
    if (!image) {
      setAlert({ message: "Please upload an image first!", type: 'warning' });
      return;
    }
    if (!platform) {
      setAlert({ message: "Please select a platform!", type: 'warning' });
      return;
    }

    setIsLoading(true);
    setGeneratedCaption(null);

    const formData = new FormData();
    formData.append("image", image);

    // Get personality data from sessionStorage
    let personalityKnowledge = "";
    try {
      const storedPersonality = sessionStorage.getItem("userPersonality");
      if (storedPersonality) {
        const personalityArray = JSON.parse(storedPersonality);
        personalityKnowledge = "User Personality Summary: " + personalityArray.map((item: any) => `${item.Question}: ${item.Answer}`).join(". ");
      }
    } catch (e) {
      console.error("Failed to load personality knowledge", e);
    }

    const promptText = platform === "Instagram"
      ? `You are a professional Instagram copywriter and personal brand strategist. ${personalityKnowledge} Given an image of a person, first analyze the facial expression and overall face sentiment (for example: calm, confident, thoughtful, playful, intense). Use this emotional insight internally to guide tone, word choice, and message alignment. Generate exactly 4 Instagram captions aligned with their visual presence, personality profile, and emotional state. Each caption must be ready to post, vary in tone, and include suitable hashtags. Do not mention the personality summary, the facial analysis, or the image description directly. Return the response as a JSON array of 4 objects, each with 'caption' and 'hashtags' keys.`
      : `You are a professional LinkedIn copywriter and personal brand strategist. ${personalityKnowledge} Given an image of a person, first analyze the facial expression and overall face sentiment (for example: calm, confident, thoughtful, playful, intense). Use this emotional insight internally to guide tone, word choice, and message alignment. Generate exactly 4 LinkedIn posts aligned with their visual presence, professional personality profile, and emotional state. Each post must be ready to publish, vary in tone, and include relevant hashtags. Do not mention the personality summary, the facial analysis, or the image description directly. Return the response as a JSON array of 4 objects, each with 'post' and 'hashtags' keys.`;

    formData.append("description", promptText);

    try {
      const response = await fetch(API_CONFIG.CAPTION_GENERATOR_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed");

      const data = await response.json();

      let captionData = data.caption;
      if (typeof captionData === 'string') {
        captionData = captionData.replace(/```json\n?|\n?```/g, '').trim();
        try {
          const parsed = JSON.parse(captionData);
          const normalized = (Array.isArray(parsed) ? parsed : [parsed]).map((item: any) => ({
            caption: item.caption || item.post || "", // Normalize 'post' to 'caption'
            hashtags: item.hashtags || []
          }));
          setGeneratedCaption(normalized);
        } catch (e) {
          console.error("Failed to parse caption JSON", e);
          // Fallback for raw text if parsing fails (wrap in single object)
          setGeneratedCaption([{ caption: data.caption, hashtags: [] }]);
        }
      } else {
        // Handle non-string data (already parsed)
        const rawData = Array.isArray(captionData) ? captionData : [captionData];
        const normalized = rawData.map((item: any) => ({
          caption: item.caption || item.post || "",
          hashtags: item.hashtags || []
        }));
        setGeneratedCaption(normalized);
      }
    } catch (error) {
      console.error(error);
      setAlert({ message: "Failed to generate caption.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-theme-bg flex items-center justify-center p-4 min-h-screen">
      <Alert
        message={alert?.message || null}
        type={alert?.type as any}
        onClose={() => setAlert(null)}
      />

      <div className={`flex flex-col ${generatedCaption ? 'xl:flex-row xl:items-stretch' : 'items-center'} justify-center gap-8 w-full transition-all duration-700`}>
        {/* Input Box */}
        <div className="glass-card w-full max-w-lg p-8 shrink-0 animate-in fade-in duration-500 flex flex-col">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="/logoMain.png"
                  alt="SnapSays Logo"
                  className="relative w-40 h-40 drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              SnapSays ✨
            </h1>
            <p className="text-white/90 mt-2 text-sm font-medium">
              Turn images into captions using AI-powered vision & language
            </p>
          </div>

          {/* Image Upload */}
          <label className="group block cursor-pointer mb-5">
            <div
              className="border-2 border-dashed border-white/40 rounded-xl p-5 text-center bg-white/10 backdrop-blur-sm
                            group-hover:border-white/70 group-hover:bg-white/20 transition-all min-h-[160px] flex flex-col items-center justify-center"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto rounded-lg max-h-60 object-contain shadow-lg"
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
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>

          {/* Remove Background Option */}
          <div className="mb-6">
            {!showRemoveBg ? (
              <button
                type="button"
                onClick={() => setShowRemoveBg(true)}
                className="w-full py-2.5 rounded-xl border border-white/20 bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-sm mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18" /><path d="M19 9a7 7 0 1 0-8.8 8.8" /></svg>
                Remove Background Image
              </button>
            ) : (
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 animate-in fade-in zoom-in-95 duration-200">
                <label className="block text-xs font-medium text-white/80 mb-2">
                  Describe background changes:
                </label>
                <textarea
                  value={bgDescription}
                  onChange={(e) => setBgDescription(e.target.value)}
                  placeholder="E.g. Remove the background and make it white..."
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-400/50 min-h-[80px]"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setShowRemoveBg(false)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRemoveBg}
                    disabled={isBgLoading || !image}
                    className="flex-1 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBgLoading ? "Processing..." : "Save & Remove"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Generated Image Result */}
          {generatedImage && (
            <div className="mb-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl">
                <h3 className="text-white font-bold text-center mb-4 text-xl">
                  🎨 AI Edited Result
                </h3>
                <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-white/10 group">
                  <img
                    src={generatedImage}
                    alt="AI Generated"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={generatedImage}
                      download="ai-generated-image.png"
                      className="px-6 py-2 bg-white text-gray-900 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      Download HD
                    </a>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => { setGeneratedImage(null); setShowRemoveBg(false); }}
                    className="text-white/60 text-sm hover:text-white underline transition-colors"
                  >
                    Clear & Start Over
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Platform Selector */}
          {!showRemoveBg && <div className="mb-6">
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
                  ${platform === p
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105 border-transparent"
                      : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>}

          {/* Generate Button */}
          {!showRemoveBg && <button
            onClick={generateCaption}
            disabled={!image || isLoading}
            className="w-full btn-primary mt-auto
                       hover:shadow-xl hover:shadow-purple-500/40
                       disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:animate-none
                       animate-pulse cursor-pointer h-14"
          >
            {isLoading ? (
              <Loader text="Generating..." size="sm" />
            ) : (
              "Generate Caption 🚀"
            )}
          </button>}
        </div>

        {/* Results Box - Separate Container */}
        {generatedCaption && (
          <div className="glass-card w-full max-w-4xl p-8 animate-in fade-in slide-in-from-right-8 duration-700 flex flex-col">
            <h3 className="text-white font-bold text-3xl mb-8 text-center drop-shadow-lg flex items-center justify-center gap-3 border-b border-white/10 pb-6">
              <span className="animate-bounce">✨</span>
              Caption Options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.isArray(generatedCaption) && generatedCaption.map((option, index) => (
                <div key={index} className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/60 transition-all hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group flex flex-col min-h-[220px]">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-pink-500 opacity-80" />

                  {/* Scrollable Area for Caption Text */}
                  <div className="flex-1 max-h-48 overflow-y-auto custom-scrollbar pr-2 mb-4">
                    <p className="text-gray-800 text-lg leading-relaxed mb-4 font-medium whitespace-pre-wrap">
                      {option.caption}
                    </p>

                    {option.hashtags && option.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {option.hashtags.map((tag, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100 uppercase tracking-tighter">
                            #{tag.replace(/^#/, '')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => {
                        const fullText = `${option.caption}\n\n${option.hashtags?.map(t => t.startsWith('#') ? t : `#${t}`).join(' ') || ''}`;
                        handleCopy(fullText.trim());
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-indigo-600 hover:text-white font-bold text-sm transition-all group-hover:shadow-md cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                      Copy Vibe
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8 flex justify-center">
              <button
                onClick={generateCaption}
                disabled={isLoading}
                className="px-8 py-4 rounded-xl border border-white/40 bg-white/20 text-white text-lg font-bold hover:bg-white/30 hover:border-white/60 transition-all flex items-center justify-center gap-3 backdrop-blur-sm shadow-xl cursor-pointer hover:scale-105 active:scale-95"
              >
                {isLoading ? "Regenerating..." : "🔄 Regenerate All Vibes"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10">
            <span className="font-semibold">Caption copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
}
