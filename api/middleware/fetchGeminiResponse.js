const {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
  Type,
} = require('@google/genai');
const { CustomAPIError } = require('../errors');
const data = require("../../test/gemini-submission.json")

async function fetchGeminiResponse() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const config = {
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
    ],
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        cover_letter: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "One of the paragraphs of the cover letter",
          },
        },
      },
    },
    systemInstruction: [
        {
          text: `You are a career success coach who speacilizes in creating covers letters for job applicants for their desired job.`,
        }
    ],
  };
  const model = 'gemini-2.0-flash';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Review this job applicant's skills and experience and and generate a 2 - 4 paragraph cover letter for the job they are applying: ${JSON.stringify(data)}`,
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    return response;

    } catch (error) {
        throw new CustomAPIError(`Error fetching AI response...${error}`, 500)
  }
}



module.exports = fetchGeminiResponse;