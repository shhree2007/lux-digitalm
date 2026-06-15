import { WebsiteBlueprint } from "./types";

export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  blueprint: {
    stack: string;
    deliveryTime: string;
    keyDeliverables: string[];
    seoFocus: string;
  };
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  highlightMetric: string;
  metricLabel: string;
  description: string;
  imageUrl: string;
  stats: { label: string; value: string }[];
  blueprintSample: WebsiteBlueprint;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "bespoke-platforms",
    title: "Bespoke Digital Platforms",
    icon: "Layers",
    description: "Develop premium custom web systems, clinics databases, client portals, and secure e-commerce.",
    blueprint: {
      stack: "Next.js, TypeScript, PostgreSQL, Tailwind",
      deliveryTime: "14-21 Days",
      keyDeliverables: ["Secure Authentication", "Interactive Dashboards", "Automated DB Schema", "SSL & Encryption"],
      seoFocus: "High local search intent, dynamic canonical indexing"
    }
  },
  {
    id: "high-velocity-landings",
    title: "High-Velocity Landing Experiences",
    icon: "Zap",
    description: "Laser-focused single page assets for gyms, salons, and niche agencies built for maximum conversion.",
    blueprint: {
      stack: "React, Vite, Motion, Tailwind Edge Assets",
      deliveryTime: "7-10 Days",
      keyDeliverables: ["Under 1.2s First Contentful Paint", "High-Converting Hero Visuals", "Fluid Call-to-Actions", "Mobile Tap Target Optimization"],
      seoFocus: "Core Web Vitals max criteria (FID < 100ms, LCP < 2.5s)"
    }
  },
  {
    id: "corporate-strategy",
    title: "Corporate Identity & Strategy",
    icon: "Sparkles",
    description: "Complete modern redesigns, logo vector suites, bespoke typography pairings, and copywriting.",
    blueprint: {
      stack: "Figma Vectors, SVG Pipelines, Brand Design Tokens",
      deliveryTime: "5-7 Days",
      keyDeliverables: ["SVG Production Assets", "Modular Design Kit", "Strategic Brand Voice Guide", "Consistent UI Token System"],
      seoFocus: "Structured metadata, schema.org JSON-LD local organization maps"
    }
  },
  {
    id: "data-architecture",
    title: "Advanced Data Architecture",
    icon: "Database",
    description: "Full-stack databases, user roles management, instant cloud synching, and real-time activity metrics.",
    blueprint: {
      stack: "Firestore DB, server-side APIs, JWT Sessions",
      deliveryTime: "10-14 Days",
      keyDeliverables: ["Row-Level Database Rules", "Real-time client listener sockets", "Automated Weekly Backups", "Audit Logging"],
      seoFocus: "Secure headless crawl availability, instant server response"
    }
  },
  {
    id: "seo-metadata-opt",
    title: "Metadata & AI Optimisation",
    icon: "Cpu",
    description: "Deep structured schema, dynamic meta keywords pipelines, image alt generator, and performance audit maps.",
    blueprint: {
      stack: "JSON-LD, Semantic Markup, Image Compressors",
      deliveryTime: "4-6 Days",
      keyDeliverables: ["Clean semantic tags hierarchy", "Dynamic meta generation", "Sitemap generator setups", "Robot.txt automated configurations"],
      seoFocus: "Complete search console indexing health, rich search snippets"
    }
  },
  {
    id: "premium-hosting",
    title: "Exclusive Support & Hosting",
    icon: "ShieldCheck",
    description: "Hassle-free 24/7 client concierge support, zero-downtime content hosting, and SSL renewals.",
    blueprint: {
      stack: "Multi-Region Cloudflare CDN Edge, SSL Auto-Renew",
      deliveryTime: "Ongoing Service",
      keyDeliverables: ["99.99% Guaranteed Server Uptime", "Weekly Automated Security Scans", "Express Response SLAs", "Continuous Software Patches"],
      seoFocus: "Global edge CDN caches, zero index downtime"
    }
  }
];

export const CLIENT_SUCCESSES: CaseStudy[] = [
  {
    id: "ironclad-fitness",
    title: "Ironclad Fitness Hub",
    category: "Gym & Fitness",
    highlightMetric: "+320%",
    metricLabel: "CLIENT SIGN-UPS IN 30 DAYS",
    description: "Replaced a bloated, slow WordPress theme with a sleek, premium single-page React app. Integrated an interactive client BMI estimator and simplified local trial reservation system.",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    stats: [
      { label: "Mobile Speed Score", value: "99/100" },
      { label: "Server Load Time", value: "0.2s" },
      { label: "Lead Conversion Rate", value: "8.4%" }
    ],
    blueprintSample: {
      businessName: "Ironclad Fitness Hub",
      businessCategory: "Gym & Fitness",
      brandPhilosophy: "High-contrast dark luxury aesthetic with athletic amber neon accents designed to convey high energy, elite strength, and modern community vibes.",
      siteMap: [
        {
          page: "Elite Performance Front",
          purpose: "Capture athletic trainees and promote visual brand culture.",
          suggestedSections: ["Cinematic Training Showcase", "Dynamic Schedule Grid", "Member Conversion Card"]
        },
        {
          page: "Vitals & Goals Calculator",
          purpose: "Engage visitors through interactive training metrics.",
          suggestedSections: ["Interactive Personal BMI Tool", "Calorie Burn Rate Matrix", "Personalized Custom Training Blueprint Proposal"]
        },
        {
          page: "Ultimate Membership Concierge",
          purpose: "Convert curious locals into paid trial subscribers with minimal friction.",
          suggestedSections: ["Direct Slot Scheduler", "Trainee Reviews", "Secure Checkout Sheet"]
        }
      ],
      interactiveFeatures: [
        {
          feature: "Dynamic Fitness Metric Estimator",
          description: "An instant user form where locals plug in their training goals and get an immediate caloric targets display plus a recommended class selection.",
          conversionBenefit: "Unlocks high curiosity and converts users by requesting their email to lock in a physical trial ticket tailored to their exact goals."
        },
        {
          feature: "Express Trial Scheduling Wizard",
          description: "A gorgeous click-and-book calendar component displaying currently open trial workouts.",
          conversionBenefit: "Dramatically reduces booking friction, increasing client bookings before competitor interaction."
        }
      ],
      techArchitecture: {
        rendering: "Vite React with Dynamic Edge Static Cache",
        cms: "Static pre-rendered Markdown specs",
        hosting: "Netlify edge routing with multi-region backup",
        speedOptimization: "Automatic layout-shift prevention, dynamic WebP resolution scaling"
      },
      seoStrategy: {
        primaryKeywords: ["luxury gym in Austin TX", "Austin custom physical training", "elite functional strength Austin"],
        secondaryKeywords: ["modern gym program Austin", "high performance health coaching Austin", "best private trainers in Austin"],
        localSeoAction: "Maximize Google Maps visibility through automated geotagged photo uploads of the training floor.",
        blogIdeas: [
          "The Anatomy of Consistent Muscle Synthesis: Science-Backed Recovery Guidelines",
          "5 Critical Nutrition Mistakes Keeping Austin Trainees Back From Absolute Optimization"
        ]
      },
      estimatedTimelineDays: 9,
      targetInvestmentEstimate: "$2,200 - $2,800 USD"
    }
  },
  {
    id: "brightsmile-dental",
    title: "BrightSmile Dental Portal",
    category: "Clinics & Medical",
    highlightMetric: "60%",
    metricLabel: "REDUCTION IN BOOKING ADMIN",
    description: "Created clean, welcoming corporate identity and integrated custom-branded HIPAA-compliant direct booking scheduling flows for patients.",
    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
    stats: [
      { label: "Intake Forms Completion", value: "94%" },
      { label: "SEO Keyword Growth", value: "+180%" },
      { label: "Lighthouse Performance", value: "100" }
    ],
    blueprintSample: {
      businessName: "BrightSmile Family Dentistry",
      businessCategory: "Dentistry & Orthodontics",
      brandPhilosophy: "Soft clinical colors, generous negative margins, and gentle transitions to project reassurance, clean hygiene, and reliable medical excellence.",
      siteMap: [
        {
          page: "Compassionate Care Frontline",
          purpose: "Alleviate patient dental anxiety and build instant professional trust.",
          suggestedSections: ["Meet Our Dedicated Clinicians", "Our Patient Comfort Guarantee", "3D Dental Virtual Tour Showcase"]
        },
        {
          page: "Hassle-Free Patient Intake",
          purpose: "Enable ultra-fast, convenient patient registration files uploads.",
          suggestedSections: ["Direct secure online HIPAA insurance files form", "Pre-appointment checklist", "Frequently Asked Insurance FAQs Docs"]
        },
        {
          page: "Orthodontic & Aesthetic Braces Portal",
          purpose: "Promote profitable cosmetic procedures like high-end teeth whitening and Invisalign.",
          suggestedSections: ["Interactive whitening slider", "Patient Transformation Stories", "Custom Consultation Schedule"]
        }
      ],
      interactiveFeatures: [
        {
          feature: "Smart Aesthetic Whitening Simulator Slider",
          description: "An elegant interactive photo before-after visualizer which lets potential cosmetic patients slide custom teeth whitening results.",
          conversionBenefit: "Fosters high emotional desire and immediate conversion to booking a consult."
        },
        {
          feature: "Direct Calendar Booking & Insurance Validation Flow",
          description: "A fast multi-device patient wizard which matches provider slots so clients register instantly.",
          conversionBenefit: "Cuts out standard reception desk phone tags completely and captures high-converting urgent appointments."
        }
      ],
      techArchitecture: {
        rendering: "Next.js Static Site Generation with dynamic booking API routes",
        cms: "Payload CMS with fully customized fields",
        hosting: "Cloud Run scalable service behind custom SSL proxy",
        speedOptimization: "Crucial CSS inline injection, dynamic font optimization with zero layout shifting style adjustments"
      },
      seoStrategy: {
        primaryKeywords: ["painless family dentist Seattle", "Seattle cosmetic Invisalign provider", "emergency tooth extraction Seattle"],
        secondaryKeywords: ["how to prepare kids for dental checkup", "Seattle top rated teeth whitening costs", "Invisalign vs traditional braces Seattle"],
        localSeoAction: "Highlight verified patient high-star reviews on homepage using organic JSON-LD review schemas.",
        blogIdeas: [
          "Behind the Smile: Why Professional Orthodontics Yield 3X Long-Term Health Over Online Whiteners",
          "Anxious About Dentists? 5 Grounding Techniques We Implement in Our Seattle Clinic Daily"
        ]
      },
      estimatedTimelineDays: 14,
      targetInvestmentEstimate: "$3,200 - $4,200 USD"
    }
  },
  {
    id: "summit-realty",
    title: "Summit Realty Group",
    category: "Real Estate Brokers",
    highlightMetric: "2.5X",
    metricLabel: "CALLBACK REGISTRATIONS IN 15 DAYS",
    description: "Developed a luxurious modern listing browser with dynamic filtering, lazy loaded high-res photo sliders, and neighborhood scoring dashboards.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600",
    stats: [
      { label: "Bounce Rate Reduction", value: "-45%" },
      { label: "Mobile Lead Growth", value: "3.4X" },
      { label: "Lighthouse SEO Score", value: "100" }
    ],
    blueprintSample: {
      businessName: "Summit Elite Realtors",
      businessCategory: "Real Estate & Luxury Estates",
      brandPhilosophy: "Sophisticated editorial serif fonts, stark high-contrast layouts, deep royal green accents, and large beautiful photography designed to evoke exclusivity, premium status, and elite architectural design.",
      siteMap: [
        {
          page: "The Premium Collection Dashboard",
          purpose: "Display rare real estate inventory and tell the luxury brand story.",
          suggestedSections: ["Feature Private Estates Carousel", "Live Active Listings Browser", "The Luxury Agents Team Directory"]
        },
        {
          page: "Interactive Valuation Concierge",
          purpose: "Capture highly valuable home seller listings leads.",
          suggestedSections: ["Live home appraisal quote form", "Local neighborhood market pricing visual tools", "Why List With Summit Guarantees"]
        },
        {
          page: "Exclusivity & Private Access Portal",
          purpose: "Register qualified investors to receive private off-market catalogs.",
          suggestedSections: ["Private catalog password request sheet", "Investor credentials form", "Off-Market Success Showcase"]
        }
      ],
      interactiveFeatures: [
        {
          feature: "Instant Home Appraisal Yield Estimator",
          description: "An elegant input form that processes local real estate trends and gives homeowners a real-time preliminary property valuation.",
          conversionBenefit: "Provides incredible immediate value for prospective home sellers in exchange for direct contact details for listing consults."
        },
        {
          feature: "Modern Immersive Listing Filtering Board",
          description: "A fast, client-side visual search matrix with smart instant category filters.",
          conversionBenefit: "Ensures property buyers stay engaged and register on-site to save custom listing lists."
        }
      ],
      techArchitecture: {
        rendering: "Next.js static pre-rendering, integrated with instant cloud real-estate updates API",
        cms: "Sanity.io headless workspace",
        hosting: "Vercel Enterprise, backed by premium AWS asset server integrations",
        speedOptimization: "Next/Image components for fully optimized asset streaming, ultra-fast prefetching routing links"
      },
      seoStrategy: {
        primaryKeywords: ["luxury homes for sale in Palm Beach", "Palm Beach waterfront estates listings", "best private realtors Palm Beach Florida"],
        secondaryKeywords: ["pricing real estate palm beach trends", "palm beach luxury penthouse market values", "sell waterfront home fast Florida"],
        localSeoAction: "Create structured Product/Place rich schemas representing currently active listings on the Palms neighborhood maps.",
        blogIdeas: [
          "Palm Beach Real Estate Trends: The Ultimate Waterfront Luxury Valuation Outlook",
          "5 Modern Architectural Essentials Command the Highest Premiums in Today's Luxury Estate Markets"
        ]
      },
      estimatedTimelineDays: 12,
      targetInvestmentEstimate: "$2,800 - $3,500 USD"
    }
  }
];

export const MILESTONES = [
  { step: "1", title: "Visionary Discovery", desc: "We sit down (virtually or physically) and outline your concrete business goals, target niche, and client acquisition bottlenecks." },
  { step: "2", title: "Strategic Blueprint", desc: "Our specialists create a custom page structure, detailed interactive blueprints, and concrete SEO keywords maps." },
  { step: "3", title: "Precision Execution", desc: "We code your customized, high-performance website from scratch using custom, lightweight React architectures." },
  { step: "4", title: "Elite Deployment", desc: "We publish your application to enterprise CDN Edge servers, configure DNS maps, and test for solid 95+ performance scores." },
  { step: "5", title: "Continuous Growth", desc: "Enjoy proactive concierge system updates, hosting maintenance, and regular traffic acquisition optimization calls." }
];
