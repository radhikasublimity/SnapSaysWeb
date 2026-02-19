import { useState } from 'react';

export interface SummarizePersonalityResponse {
  summary?: string;
  hashtags?: string[];
  success?: boolean;
}

export const useSummarizePersonality = () => {
  const [isPending, setIsPending] = useState(false);

  // Mimics the mutate function from useMutation
  const mutate = async (
    variables: { answers: Record<string, string>; prompt: string },
    options?: { onSuccess?: (data: SummarizePersonalityResponse) => void; onError?: (error: any) => void }
  ) => {
    setIsPending(true);
    try {
      console.log("SummarizePersonality Input:", { answers: variables.answers, promptLength: variables.prompt.length });
      
      const formData = new FormData();
      const payload = {
        answers: variables.answers,
        command: variables.prompt,
      };

      formData.append("description", JSON.stringify(payload));
      console.log("SummarizePersonality Payload:", JSON.stringify(payload));
      console.log("SummarizePersonality: Sending request to /api/summarize-personality...");

      const response = await fetch("http://Snapsaystest.Sublimitysoft.Com/api/summarize-personality", {
        method: "POST",
        body: formData,
        // fetch automatically sets the Content-Type to multipart/form-data with the correct boundary
        headers: {
            Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Summary failed";
        try {
             const errorJson = JSON.parse(errorText);
             errorMessage = errorJson.message || errorMessage;
        } catch (e) {
            // ignore
        }
        throw new Error(`${errorMessage} (${response.status})`);
      }

      const data = await response.json();
      console.log("SummarizePersonality Response Success:", data);
      
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error: any) {
      console.error("SummarizePersonality Error:", error);
      if (options?.onError) {
        options.onError(error);
      }
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};
