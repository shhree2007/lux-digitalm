import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON bodies
app.use(express.json());

// In-memory store for proposals submitted via the contact form
const proposalsDb: any[] = [];

// Request Logging Middleware for tracking and debugging requests
app.use((req, res, next) => {
  console.log(`[HTTP MASTER LOG] ${req.method} ${req.url} - IP: ${req.ip} - Time: ${new Date().toISOString()}`);
  next();
});

// Lazy-initialized Gemini Client to prevent crash if key is undefined at startup
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in environments. Fetching with blank initializer.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MISSING_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API endpoint to generate bespoke business strategy blueprint with Gemini
app.post("/api/blueprint", async (req: Request, res: Response): Promise<void> => {
  try {
    const { businessName, businessCategory, description } = req.body;

    if (!businessName || !businessCategory) {
      res.status(400).json({ error: "Please provide a business name and category." });
      return;
    }

    const systemPrompt = `You are an elite, world-class Lead Website Architect, Conversion Rate Optimizer (CRO), and SEO Director at Luxe Digital, a premier digital agency. 
Your goal is to build an absolute masterpiece of a website blueprint and digital growth strategy for a small business owner. 
Return your complete strategic plan exclusively as a JSON object matching the requested schema. Provide inspiring, specific, and premium advice. Avoid generic placeholder labels (e.g. do not write 'Section 1'); instead write actual, compelling headers, content directions, and tangible solutions.`;

    const userPrompt = `Generate a Bespoke Digital Strategy Blueprint for this small business:
Company Name: "${businessName}"
Industry/Category: "${businessCategory}"
Business Description/Focus: "${description || "A standard quality business seeking high online visibility and client conversions."}"`;

    const response = await getGenAI().models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessName: { type: Type.STRING, description: "Name of the business." },
            businessCategory: { type: Type.STRING, description: "Category/industry of the business." },
            brandPhilosophy: { type: Type.STRING, description: "A high-end 1-2 sentence brand positioning and design aesthetic philosophy tailored precisely for this niche." },
            siteMap: {
              type: Type.ARRAY,
              description: "The 3 suggested main pages for their core online experience.",
              items: {
                type: Type.OBJECT,
                properties: {
                  page: { type: Type.STRING, description: "Page title (e.g., 'Interactive Virtual Showroom', 'Bespoke Patient Portal', 'Our Craftsmanship')." },
                  purpose: { type: Type.STRING, description: "Crucial strategic objective this page fulfils." },
                  suggestedSections: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 highly compelling section titles and brief structural blocks on this page."
                  }
                },
                required: ["page", "purpose", "suggestedSections"]
              }
            },
            interactiveFeatures: {
              type: Type.ARRAY,
              description: "2 custom interactive features/tools that will capture leads (calculators, wizards, virtual schedulers).",
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING, description: "Name of the interactive feature (e.g., 'Smile Simulator Questionnaire', 'Dynamic ROI Yield Estimator')." },
                  description: { type: Type.STRING, description: "What the feature is and how it functions." },
                  conversionBenefit: { type: Type.STRING, description: "Exact psychological trigger or conversion mechanic why this turns traffic into qualified leads." }
                },
                required: ["feature", "description", "conversionBenefit"]
              }
            },
            techArchitecture: {
              type: Type.OBJECT,
              properties: {
                rendering: { type: Type.STRING, description: "Recommended framework (e.g. Next.js App Router for Dynamic, Vite React with Static Pre-rendering for ultimate speed)." },
                cms: { type: Type.STRING, description: "CMS suggestions (e.g. Payload CMS or Headless Sanity, or simple Markdown-based static schema so they pay zero hosting fees)." },
                hosting: { type: Type.STRING, description: "Hosting setup suggestion (e.g. Vercel Edge Serverless, Cloud Run or Netlify with Multi-Region CDN routing)." },
                speedOptimization: { type: Type.STRING, description: "Performance secrets (e.g. WebP dynamic image compression, critical CSS path injection, layout shifting prevention)." }
              },
              required: ["rendering", "cms", "hosting", "speedOptimization"]
            },
            seoStrategy: {
              type: Type.OBJECT,
              properties: {
                primaryKeywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 high-intent search terms (e.g., 'emergency dentist in Austin Texas', 'bespoke modern jewelry design Brooklyn')."
                },
                secondaryKeywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 long-tail secondary terms to rank for informational searches easily."
                },
                localSeoAction: { type: Type.STRING, description: "A high-impact 1-sentence local SEO advice mapping to Google Business Profile priority." },
                blogIdeas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "2 thought-leadership blog titles that build authority and organically capture search traffic."
                }
              },
              required: ["primaryKeywords", "secondaryKeywords", "localSeoAction", "blogIdeas"]
            },
            estimatedTimelineDays: { type: Type.INTEGER, description: "Rough timeline estimation (usually between 10 and 21 days depending on interactive scope)." },
            targetInvestmentEstimate: { type: Type.STRING, description: "Premium, yet realistic investment range for a custom development build (e.g., '$2,500 - $3,800 USD')." }
          },
          required: [
            "businessName",
            "businessCategory",
            "brandPhilosophy",
            "siteMap",
            "interactiveFeatures",
            "techArchitecture",
            "seoStrategy",
            "estimatedTimelineDays",
            "targetInvestmentEstimate"
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini Generation Error:", err);
    res.status(500).json({ error: "Failed to assemble blueprint. Please verify your GEMINI_API_KEY in Settings." });
  }
});

// Capture a standard proposal request from prospects
app.post("/api/proposals", (req: Request, res: Response) => {
  const { name, email, businessConcept } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: "Please input both your Name and Email." });
    return;
  }

  const newProposal = {
    id: `proposal_${Date.now()}`,
    name,
    email,
    businessConcept: businessConcept || "Custom Growth Architecture Consult",
    createdAt: new Date().toISOString(),
  };

  proposalsDb.unshift(newProposal);
  res.json({ success: true, message: "Proposal request received perfectly! We'll get in touch with you shortly.", data: newProposal });
});

// View active proposal requests (useful for developers' testing / showcase)
app.get("/api/proposals", (req: Request, res: Response) => {
  res.json(proposalsDb);
});

// Setup Vite Dev Server / Static Hosting Middleware
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite loaded in Development Middleware mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startApp().catch((err) => {
  console.error("Failed to boot full-stack server application:", err);
});
