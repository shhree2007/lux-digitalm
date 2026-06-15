import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Layers,
  Zap,
  Sparkles,
  Database,
  Cpu,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Search,
  Check,
  ChevronRight,
  Calculator,
  MessageSquare,
  HelpCircle,
  Award,
  Globe,
  Plus,
  AlertCircle,
  FileText
} from "lucide-react";
import { SERVICES, CLIENT_SUCCESSES, MILESTONES, ServiceItem, CaseStudy } from "./data";
import { WebsiteBlueprint, ProposalSubmission } from "./types";

// Helper component to render icons based on name
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const icons: { [key: string]: any } = {
    Layers, Zap, Sparkles, Database, Cpu, ShieldCheck, CheckCircle, TrendingUp, Clock, Globe, Award
  };
  const IconComponent = icons[name] || HelpCircle;
  return <IconComponent className={className} />;
};

export default function App() {
  // Navigation active state
  const [activeTab, setActiveTab] = useState("overview");

  // State for AI Generator input
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Bespoke Hair Salon");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  
  // State for the active blueprint shown in the dashboard
  // Default to the first case study's blueprint to make it zero-wait preloaded as a sample!
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy>(CLIENT_SUCCESSES[1]); // BrightSmile Dental
  const [currentBlueprint, setCurrentBlueprint] = useState<WebsiteBlueprint>(CLIENT_SUCCESSES[1].blueprintSample);

  // Proposal request form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactConcept, setContactConcept] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactResult, setContactResult] = useState<{ success: boolean; message: string } | null>(null);

  // Interactive Price Estimator State
  const [pagesCount, setPagesCount] = useState(5);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [needsDatabase, setNeedsDatabase] = useState(false);
  const [needsCms, setNeedsCms] = useState(true);
  const [hasSlaSupport, setHasSlaSupport] = useState(false);

  // Selected Service blueprint drawer state
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Pre-set business categories for easy generation clicking
  const SUGGESTED_CATEGORIES = [
    "Bespoke Hair Salon & Spa",
    "Luxury Family Chiropractic",
    "Elite Personal Training Studio",
    "Boutique Real Estate Brokerage",
    "High-End Dental Practice",
    "Artisanal Coffee & Bakery",
    "Fine Dining Bistro",
    "Local Law Firm"
  ];

  // Watch case study change to update shown blueprint
  useEffect(() => {
    setCurrentBlueprint(selectedCaseStudy.blueprintSample);
  }, [selectedCaseStudy]);

  // Handle generating custom blueprint via Express server-side Gemini route
  const handleGenerateBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = businessCategory === "custom" ? customCategory : businessCategory;
    
    if (!businessName.trim()) {
      setGenerationError("Please enter a business name to personalize your blueprint.");
      return;
    }
    if (businessCategory === "custom" && !customCategory.trim()) {
      setGenerationError("Please enter your custom business category.");
      return;
    }

    setIsGenerating(true);
    setGenerationError("");
    setContactResult(null);

    try {
      const response = await fetch("/api/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          businessCategory: finalCategory,
          description: description.trim()
        })
      });

      if (!response.ok) {
        throw new Error("Failed to reach server. Please review your server logs.");
      }

      const blueprintData: WebsiteBlueprint = await response.json();
      
      if (blueprintData.error) {
        throw new Error(blueprintData.error);
      }

      setCurrentBlueprint(blueprintData);
      
      // Auto-populate the contact form concept with a reference to their blueprint
      setContactConcept(`I want to build the custom blueprint for "${blueprintData.businessName}" (${blueprintData.businessCategory})! My estimated price was ${blueprintData.targetInvestmentEstimate}.`);
      
      // Scroll smoothly to dashboard visualization
      const dashboardElement = document.getElementById("blueprint-visualizer");
      if (dashboardElement) {
        dashboardElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "Something went wrong while generating the roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Proposal Form Submission to Express Route
  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) {
      setContactResult({ success: false, message: "Please fill in your Name and Email address." });
      return;
    }

    setIsSubmittingContact(true);
    setContactResult(null);

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          businessConcept: contactConcept.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        setContactResult({ success: true, message: data.message });
        setContactName("");
        setContactEmail("");
        setContactConcept("");
      } else {
        setContactResult({ success: false, message: data.error || "Failed to submit proposal." });
      }
    } catch (err) {
      setContactResult({ success: false, message: "Communication error. Please ensure your dev server is active and try again." });
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Calculate estimated investment based on interactive calculator sliders
  const calculateEstimatedInvestment = () => {
    let basePrice = 1200; // Standard premium landing page
    basePrice += pagesCount * 220; // Price per extra page
    if (needsAuth) basePrice += 600; // Customer Portal/Accounts
    if (needsDatabase) basePrice += 800; // Structured Databases / Data Sync
    if (needsCms) basePrice += 400; // Headless CMS Workspace
    if (hasSlaSupport) basePrice += 450; // Performance SLA / Support tier

    const lowRange = Math.round(basePrice * 0.9);
    const highRange = Math.round(basePrice * 1.15);
    return `$${lowRange.toLocaleString()} - $${highRange.toLocaleString()} USD`;
  };

  return (
    <div className="min-h-screen text-slate-100 selection:bg-cyan-500 selection:text-black">
      
      {/* Decorative ambient glowing backdrops as shown in target image */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] ambient-glow-cyan pointer-events-none -translate-x-1/2 z-0" />
      <div className="absolute top-[1200px] right-0 w-[500px] h-[500px] ambient-glow-amber pointer-events-none z-0" />
      <div className="absolute bottom-[800px] left-1/3 w-[600px] h-[600px] ambient-glow-cyan pointer-events-none z-0" />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-900 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-950/40">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <span className="font-display font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">LD</span>
              </div>
            </div>
            <div>
              <span className="font-display font-bold tracking-tight text-lg text-white">LUXE</span>
              <span className="text-cyan-400 font-mono text-xs ml-1.5 px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded">STUDIO</span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#overview" onClick={() => setActiveTab("overview")} className="text-slate-300 hover:text-cyan-400 transition-colors">Overview</a>
            <a href="#services" onClick={() => setActiveTab("services")} className="text-slate-300 hover:text-cyan-400 transition-colors">Services</a>
            <a href="#success" onClick={() => setActiveTab("success")} className="text-slate-300 hover:text-cyan-400 transition-colors">Success Stories</a>
            <a href="#milestones" className="text-slate-300 hover:text-cyan-400 transition-colors">Milestones</a>
            <a href="#pricing" className="text-slate-300 hover:text-cyan-400 transition-colors">Investment</a>
          </nav>

          <div className="flex items-center space-x-4">
            <a
              href="#generate-blueprint"
              className="px-4 py-2 text-xs font-semibold font-mono tracking-wider rounded-lg border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-500/10 hover:shadow-neon-cyan transition-all duration-300"
            >
              FREE AI BLUEPRINT
            </a>
            <a
              href="#contact"
              className="px-4 py-2 text-xs font-semibold font-mono tracking-wider text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg shadow-lg shadow-cyan-500/20 active:translate-y-0.5 transition-all"
            >
              HIRE US
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative pt-20 pb-16 px-6 z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>CRAFTING ELITE ONLINE PRESENCES FOR GROWING BRANDS</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Crafting Digital <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                Legacies for Elite Brands.
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              We design fully custom, conversion-focused websites integrated with secure databases and optimized metadata. Perfect for local clinics, salons, gyms, real estate brokerages, and professional service business owners seeking unmatched speed, pristine design, and automatic local SEO rankings.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#generate-blueprint"
                className="px-6 py-3 text-sm font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-display flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 hover:shadow-neon-amber hover:opacity-95 transition-all text-center"
              >
                <span>Concierge AI Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#services"
                className="px-6 py-3 text-sm font-semibold rounded-lg bg-slate-900 text-slate-200 font-mono border border-slate-800 hover:border-slate-700 hover:bg-slate-850 flex items-center justify-center space-x-2 transition-all text-center"
              >
                <span>Explore Bespoke Solutions</span>
              </a>
            </div>
            
            <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              No Clunk templates. Handcoded static-edge loading speeds. Ready for Google Business Maps dominance.
            </p>
          </div>

          {/* Right Hero Image Frame - matching the exact frame design concept of the mockup */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-amber-500/20 blur-xl opacity-60 pointer-events-none" />
            <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-2xl">
              
              {/* Fake Mac Window Bar */}
              <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-900">
                <div className="flex space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70 block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70 block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70 block" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono font-medium">lighthouse-audit-dashboard.io</span>
                <div className="w-6" />
              </div>

              {/* Fake performance dial graphic similar to standard preview visual */}
              <div className="pt-4 pb-2 px-4 space-y-4 bg-[#05060b] rounded-b-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white font-mono font-semibold">BrightSmile Dental Portal Case</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-900 px-1.5 py-0.5 rounded">Lighthouse score</span>
                </div>

                <div className="flex items-center justify-around py-4 bg-slate-900/40 border border-slate-900 rounded-lg">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-green-500" strokeWidth="2.5" strokeDasharray="99, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-sm font-mono font-bold text-green-500">99</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block font-mono">Performance</span>
                  </div>

                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-green-500" strokeWidth="2.5" strokeDasharray="100, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-sm font-mono font-bold text-green-500">100</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block font-mono">Accessibility</span>
                  </div>

                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-green-500" strokeWidth="2.5" strokeDasharray="100, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-sm font-mono font-bold text-green-500">100</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block font-mono">SEO Audit</span>
                  </div>
                </div>

                {/* Growth visual mini chart */}
                <div className="p-3 bg-slate-900/60 border border-slate-900 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                      Conversion Rate Over Time
                    </span>
                    <span className="text-slate-200 font-bold text-cyan-400">+320% Boost</span>
                  </div>
                  {/* Decorative chart lines */}
                  <div className="h-10 w-full flex items-end gap-1.5 pt-2">
                    <div className="bg-slate-850 h-1/4 rounded-sm flex-1" />
                    <div className="bg-slate-850 h-[30%] rounded-sm flex-1" />
                    <div className="bg-slate-850 h-1/3 rounded-sm flex-1" />
                    <div className="bg-cyan-950/40 border border-cyan-800 h-[50%] rounded-sm flex-1" />
                    <div className="bg-cyan-900/50 border border-cyan-700 h-[65%] rounded-sm flex-1" />
                    <div className="bg-cyan-600/60 border border-cyan-500 h-[80%] rounded-sm flex-1" />
                    <div className="bg-gradient-to-t from-cyan-500 to-cyan-300 h-[100%] rounded-sm flex-1 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust Counters / Indicators */}
      <section className="border-y border-slate-900 bg-slate-950/50 relative z-10 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-display font-extrabold text-white">250+</p>
            <p className="text-[10px] sm:text-xs font-mono text-cyan-400 tracking-wider uppercase">Elite Deployments</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-display font-extrabold text-white">99.9%</p>
            <p className="text-[10px] sm:text-xs font-mono text-amber-400 tracking-wider uppercase">Client Satisfaction</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-display font-extrabold text-white">5.0X</p>
            <p className="text-[10px] sm:text-xs font-mono text-cyan-400 tracking-wider uppercase">Lead Conversion Growth</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-display font-extrabold text-white">TOP 1%</p>
            <p className="text-[10px] sm:text-xs font-mono text-amber-400 tracking-wider uppercase">Aesthetic Execution</p>
          </div>
        </div>
      </section>

      {/* SECTION: AI Bespoke Roadmap Generator Panel */}
      <section id="generate-blueprint" className="py-24 px-6 relative z-10 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <span className="px-3 py-1 bg-cyan-950/60 text-cyan-400 border border-cyan-900 rounded-full font-mono text-xs tracking-wider uppercase">
            AI-Driven Concept Design
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
            Free Personalized Client Strategy Blueprint
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Input your small business parameters below. Our server-side Gemini AI engine compiles an instant website architecture proposal, specialized conversion trigger tools, timeline estimates, and a targeted local SEO keyword strategy instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Input Form Card */}
          <div className="lg:col-span-5 bg-slate-950/60 border border-slate-900 rounded-xl p-6 md:p-8 backdrop-blur-md relative">
            <div className="absolute top-0 right-10 w-16 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <h3 className="font-display font-semibold text-lg text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              Blueprint Constructor Parameters
            </h3>

            <form onSubmit={handleGenerateBlueprint} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 block font-medium">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Sage Dental Care, Iron Gym"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 block font-medium">Industry Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_CATEGORIES.slice(0, 4).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setBusinessCategory(cat);
                        setCustomCategory("");
                      }}
                      className={`text-left p-2.5 rounded-lg border text-xs text-slate-300 truncate font-mono transition-all ${
                        businessCategory === cat
                          ? "bg-cyan-950/30 border-cyan-500 text-cyan-300"
                          : "bg-slate-900/60 border-slate-900 hover:border-slate-800 hover:bg-slate-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setBusinessCategory("custom")}
                    className={`text-left p-2.5 rounded-lg border text-xs text-slate-300 text-center font-mono transition-all ${
                      businessCategory === "custom"
                        ? "bg-cyan-950/30 border-cyan-500 text-cyan-300"
                        : "bg-slate-900/60 border-slate-900 hover:border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    Custom Category...
                  </button>
                </div>
              </div>

              {businessCategory === "custom" && (
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-300 block font-medium">Custom Business Category</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. Organic Pet Spa, Luxury Watch Repair"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 block font-medium">Niche focus / Special Requests (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. We target high-income neighborhood clients, looking for clean white palette styles, automatic appointment booking capabilities."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono resize-none"
                />
              </div>

              {generationError && (
                <div className="p-3 bg-red-950/40 border border-red-900 rounded-lg flex items-start gap-2.5 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span className="font-mono">{generationError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 px-4 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-display font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/10 cursor-pointer disabled:opacity-50 transition-all h-12 text-sm uppercase tracking-wider relative overflow-hidden"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="font-mono text-xs">Gemini is compiling strategy blueprint...</span>
                  </div>
                ) : (
                  <>
                    <span>Generate Bespoke Strategy</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Visualization Output Card Dashboard (Simulating the mockup) */}
          <div id="blueprint-visualizer" className="lg:col-span-7 bg-slate-950/60 border border-cyan-500/10 rounded-xl p-1 md:p-1.5 backdrop-blur-md relative">
            <div className="absolute inset-x-0 -top-5 flex justify-center pointer-events-none">
              <span className="text-[10px] text-cyan-400 bg-cyan-950/80 border border-cyan-900 px-3 py-1 rounded-full font-mono tracking-wider">
                {isGenerating ? "CONSTRUCTING BLUEPRINT..." : "LIVE INTERACTIVE PREVIEW ARCHITECTURE"}
              </span>
            </div>

            {/* Inner Dashboard Container matching visual mockup style */}
            <div className="bg-[#05070c] rounded-lg p-5 md:p-8 space-y-8 relative overflow-hidden min-h-[500px]">
              
              {/* Spinning background accent */}
              <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

              {/* Blueprint Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-400 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 block animate-pulse" />
                    <span>Luxe Custom Architect Platform</span>
                    <span>•</span>
                    <span className="text-slate-500">Auto Generated Client Audit</span>
                  </div>
                  <h3 className="text-2xl font-display font-extrabold text-white tracking-tight">
                    {currentBlueprint.businessName}
                  </h3>
                  <span className="text-xs font-mono text-slate-400">{currentBlueprint.businessCategory} Strategy</span>
                </div>

                <div className="bg-slate-900/60 border border-slate-850 px-4 py-2.5 rounded-lg flex items-center gap-3">
                  <div className="relative w-11 h-11 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle className="text-slate-800" strokeWidth="2.5" stroke="currentColor" fill="none" cx="18" cy="18" r="16" />
                      <circle className="text-green-500 animate-pulse" strokeWidth="2.5" strokeDasharray="99, 100" strokeLinecap="round" stroke="currentColor" fill="none" cx="18" cy="18" r="16" />
                    </svg>
                    <span className="absolute text-xs font-mono font-bold text-green-500">99</span>
                  </div>
                  <div className="font-mono">
                    <p className="text-[10px] text-slate-400 leading-none">MOBILITY SPEED</p>
                    <p className="text-xs text-white font-semibold mt-0.5">Top-Tier Load</p>
                  </div>
                </div>
              </div>

              {/* Brand Philosophy Section */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Bespoke Aesthetic DNA & Philosophy
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-cyan-500/30 pl-4">
                  "{currentBlueprint.brandPhilosophy}"
                </p>
              </div>

              {/* Core Sitemaps Structure */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Recommended Page Structures
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentBlueprint.siteMap.map((page, idx) => (
                    <div key={idx} className="p-4 bg-slate-900/30 border border-slate-900 rounded-lg hover:border-slate-850 transition-all space-y-2 text-xs">
                      <div className="font-mono text-[10px] text-cyan-500">PAGE 0{idx + 1}</div>
                      <h5 className="font-semibold text-white truncate font-display">{page.page}</h5>
                      <p className="text-slate-400 text-[11px] leading-tight line-clamp-2">{page.purpose}</p>
                      
                      <div className="pt-2 border-t border-slate-900 space-y-1">
                        {page.suggestedSections.slice(0, 3).map((sec, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-1.5 text-slate-400 text-[10px] truncate leading-none">
                            <span className="w-1 h-1 rounded-full bg-slate-600 inline-block shrink-0" />
                            <span className="truncate">{sec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Blueprint Lead Generation Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-3">
                  <h4 className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Psychological Lead Triggers
                  </h4>

                  <div className="space-y-3">
                    {currentBlueprint.interactiveFeatures.map((feat, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/50 border border-slate-900 rounded-lg text-xs space-y-1">
                        <span className="font-bold text-white font-display block">{feat.feature}</span>
                        <p className="text-slate-400 text-[11px] leading-relaxed select-text">{feat.description}</p>
                        <span className="text-[10px] font-mono text-cyan-300 block bg-cyan-950/20 py-0.5 px-1.5 rounded mt-1 select-text">
                          💡 CRO Benefit: {feat.conversionBenefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                    Google Search SEO Alignment
                  </h4>

                  <div className="p-4 bg-slate-900/50 border border-slate-900 rounded-lg text-xs space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-500 block font-mono">PRIMARY LOCAL KEYWORDS</span>
                      <div className="flex flex-wrap gap-1">
                        {currentBlueprint.seoStrategy.primaryKeywords.map((kw, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-800 text-[10px] text-slate-300 font-mono border border-slate-850 rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 border-t border-slate-900 pt-3">
                      <span className="text-[10px] text-slate-500 block font-mono">LOCAL MAPS STRATEGY</span>
                      <p className="text-[11px] text-slate-300 leading-normal">{currentBlueprint.seoStrategy.localSeoAction}</p>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-900 pt-3">
                      <span className="text-[10px] text-slate-500 block font-mono">CONTENT AUTHORITY BLOG HELPS</span>
                      <div className="space-y-1 text-[11px]">
                        {currentBlueprint.seoStrategy.blogIdeas.map((idea, idx) => (
                          <div key={idx} className="flex items-start gap-1 text-slate-400 font-mono">
                            <span className="text-amber-500">•</span>
                            <span className="leading-tight">{idea}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Technical Stack Architecture */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-900">
                <div className="text-xs">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">CORE FRAMEWORK</span>
                  <span className="font-semibold text-white mt-0.5 block truncate font-mono text-[11px] text-cyan-400">{currentBlueprint.techArchitecture?.rendering}</span>
                </div>
                <div className="text-xs">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">CONTENT RETRIEVAL</span>
                  <span className="font-semibold text-white mt-0.5 block truncate font-mono text-[11px]">{currentBlueprint.techArchitecture?.cms}</span>
                </div>
                <div className="text-xs">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">EDGE CDNS</span>
                  <span className="font-semibold text-white mt-0.5 block truncate font-mono text-[11px]">{currentBlueprint.techArchitecture?.hosting}</span>
                </div>
                <div className="text-xs">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">PERFORMANCE SECRET</span>
                  <span className="font-semibold text-white mt-0.5 block truncate font-mono text-[11px] text-amber-500">{currentBlueprint.techArchitecture?.speedOptimization}</span>
                </div>
              </div>

              {/* Timeline & Estimate Banner */}
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center p-2 text-amber-400">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block leading-none">APPROX METRIC TIMELINE</span>
                    <span className="text-sm font-semibold text-white font-mono mt-0.5 block">
                      ~{currentBlueprint.estimatedTimelineDays} Days Launch Delivery
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:text-right">
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-500 font-mono block leading-none">TARGET VALUE INVESTMENT</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5 block">
                      {currentBlueprint.targetInvestmentEstimate}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center p-2 text-cyan-400 sm:hidden">
                    💎
                  </div>
                  <a
                    href="#contact"
                    className="px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-mono font-bold rounded-lg hover:shadow-neon-cyan transition-all"
                  >
                    CLAIM ENGINE
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION: SERVICES IN ACTION */}
      <section id="services" className="py-24 border-t border-slate-900 bg-slate-950/30 relative z-10 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="px-3 py-1 bg-amber-950/60 text-amber-400 border border-amber-900 rounded-full font-mono text-xs tracking-wider uppercase">
              Core Deliverables
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
              We design to custom conversion-focused.
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Say goodbye to WordPress themes that drag down performance and damage SEO rankings. We hand-code robust, lightweight platforms with elegant speed optimizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((serv) => (
              <div
                key={serv.id}
                className="bg-slate-950/90 border border-slate-900 rounded-xl p-6 relative hover:border-cyan-500/20 hover:shadow-neon-cyan transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <IconRenderer name={serv.icon} className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-display font-semibold text-white">{serv.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{serv.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400">Time: {serv.blueprint.deliveryTime}</span>
                  <button
                    onClick={() => setSelectedService(serv)}
                    className="text-xs font-mono text-cyan-400 flex items-center gap-1 hover:text-cyan-300 transition-colors"
                  >
                    <span>Show Delivery Blueprint</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Dynamic Popover modal for service drawer */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#05070c] border border-cyan-500/20 max-w-lg w-full rounded-xl p-6 md:p-8 space-y-6 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <IconRenderer name={selectedService.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-display font-bold text-white">{selectedService.title}</h4>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">SPECIFICATION SHEET</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-850"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase text-[9px] block">ENGINEERING STACK</span>
                  <p className="text-cyan-300 font-semibold text-sm bg-slate-900/60 p-2.5 rounded border border-slate-900">
                    {selectedService.blueprint.stack}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-500 uppercase text-[9px] block">CORE CONTRACTUAL DELIVERABLES</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedService.blueprint.keyDeliverables.map((deliv, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-slate-900/30 border border-slate-900/80 rounded">
                        <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        <span className="text-slate-300 text-[11px] truncate">{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 uppercase text-[9px] block">SEO STRATEGIC TARGET</span>
                  <p className="text-amber-400 text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-900">
                    {selectedService.blueprint.seoFocus}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900 flex justify-between items-center">
                <span className="text-[11px] font-mono text-slate-400">Normal Turnaround: {selectedService.blueprint.deliveryTime}</span>
                <button
                  onClick={() => {
                    setContactConcept(`I want a quote for custom development of ${selectedService.title}!`);
                    setSelectedService(null);
                    const contactSection = document.getElementById("contact");
                    if (contactSection) contactSection.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2 bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs font-mono font-bold rounded-lg"
                >
                  REQUEST ESTIMATE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECTION: CASE STUDIES & PROVEN SUCCESS */}
      <section id="success" className="py-24 border-t border-slate-900 relative z-10 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-cyan-950/60 text-cyan-400 border border-cyan-900 rounded-full font-mono text-xs tracking-wider uppercase">
                Proven Client Success
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
                High-impact case studies.
              </h2>
            </div>

            {/* Case study switcher tabs */}
            <div className="flex flex-wrap gap-2">
              {CLIENT_SUCCESSES.map((study) => (
                <button
                  key={study.id}
                  onClick={() => setSelectedCaseStudy(study)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold tracking-wider transition-all cursor-pointer ${
                    selectedCaseStudy.id === study.id
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-950/80 border border-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {study.title}
                </button>
              ))}
            </div>
          </div>

          {/* Active Case Study Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-slate-950/40 border border-slate-900 p-6 md:p-10 rounded-2xl relative overflow-hidden backdrop-blur-md">
            
            {/* Visual Case Study Details */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-mono text-cyan-400 border border-cyan-900/50 bg-cyan-950/20 px-2.5 py-1 rounded inline-block">
                  {selectedCaseStudy.category} Case
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-semibold text-white">
                  How we triggered <span className="text-cyan-400">{selectedCaseStudy.highlightMetric} growth</span>.
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed select-text font-sans">
                  {selectedCaseStudy.description}
                </p>
              </div>

              {/* Dynamic stats list built for the clients */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-900 pt-6">
                {selectedCaseStudy.stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1 text-center font-mono bg-slate-900/30 p-3 rounded-lg border border-slate-900">
                    <span className="text-[10px] text-slate-500 block uppercase truncate">{stat.label}</span>
                    <span className="text-base font-bold text-white block">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-900">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 block" />
                  <span className="text-xs font-mono text-slate-400">Status: Active & Ranking #1 Local Keyword</span>
                </div>

                <a
                  href="#generate-blueprint"
                  onClick={() => {
                    setCurrentBlueprint(selectedCaseStudy.blueprintSample);
                    const blueMap = document.getElementById("generate-blueprint");
                    if (blueMap) blueMap.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs text-amber-400 font-mono flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <span>Examine Website Structure Blueprint</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Simulated Mobile Mockup / High End Image showcase */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-amber-500/10 rounded-xl filter blur-2xl opacity-60 pointer-events-none" />
              <div className="relative w-full max-w-md h-72 md:h-96 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                <img
                  src={selectedCaseStudy.imageUrl}
                  alt={selectedCaseStudy.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Big Metric Badge on the Image */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-slate-950/95 border border-slate-800 backdrop-blur-md space-y-1">
                  <span className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                    {selectedCaseStudy.highlightMetric}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block tracking-widest leading-none uppercase">
                    {selectedCaseStudy.metricLabel}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION: INTERACTIVE PRICE & SCOPE CALCULATOR */}
      <section id="pricing" className="py-24 border-t border-slate-900 bg-slate-950/20 relative z-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="px-3 py-1 bg-amber-950/60 text-amber-400 border border-amber-900 rounded-full font-mono text-xs tracking-wider uppercase">
              Transparent Framework Estimates
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
              Honest custom pricing scopes.
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              We do not tie you down with expensive monthly retainer subscriptions. Standard deployments are fully finished within weeks with clear flat fees. Use this scoping slider calculator tool to map your exact required technology stack costs instantly.
            </p>

            <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-lg space-y-2 text-xs font-mono">
              <div className="flex items-start gap-2.5 text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Includes comprehensive responsive layout testing for smartphones & tablets.</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Includes complete local metadata structure injection for Google Maps Crawler.</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Includes initial fast-loading performance speed optimization certification.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-950/90 border border-slate-900 rounded-xl p-6 md:p-8 relative">
            <div className="absolute top-0 right-1/4 w-32 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent text-xs" />
            <h3 className="font-display font-semibold text-lg text-white mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400 animate-pulse" />
              Bespoke Project Calculator
            </h3>

            <div className="space-y-6">
              {/* Slider for Pages Estimation */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300 font-medium">Estimated Website Pages Range</span>
                  <span className="text-cyan-400 font-bold">{pagesCount} Page{pagesCount > 1 ? "s" : ""} Experience</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={pagesCount}
                  onChange={(e) => setPagesCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500 border border-slate-800"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>1 Page (Landing)</span>
                  <span>5 Pages (Standard)</span>
                  <span>10 Pages (Comprehensive)</span>
                  <span>15 Pages (Heavy Asset)</span>
                </div>
              </div>

              {/* Toggle Switch Options for Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div
                  onClick={() => setNeedsAuth(!needsAuth)}
                  className={`p-4 rounded-lg border-2 cursor-pointer select-none transition-all flex items-center gap-3 ${
                    needsAuth
                      ? "bg-slate-900/60 border-cyan-500 text-cyan-300"
                      : "bg-slate-950 border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={needsAuth}
                    onChange={() => {}} // Swapped via parent click
                    className="accent-cyan-500 cursor-pointer pointer-events-none"
                  />
                  <div className="font-mono text-xs">
                    <p className="font-bold text-white">Client Portal / Accounts</p>
                    <p className="text-[10px] text-slate-500">Secure user passport profiles (+ $600)</p>
                  </div>
                </div>

                <div
                  onClick={() => setNeedsDatabase(!needsDatabase)}
                  className={`p-4 rounded-lg border-2 cursor-pointer select-none transition-all flex items-center gap-3 ${
                    needsDatabase
                      ? "bg-slate-900/60 border-cyan-500 text-cyan-300"
                      : "bg-slate-950 border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={needsDatabase}
                    onChange={() => {}}
                    className="accent-cyan-500 cursor-pointer pointer-events-none"
                  />
                  <div className="font-mono text-xs">
                    <p className="font-bold text-white">Advanced Database Sync</p>
                    <p className="text-[10px] text-slate-500">Live dynamic queries & entries (+ $800)</p>
                  </div>
                </div>

                <div
                  onClick={() => setNeedsCms(!needsCms)}
                  className={`p-4 rounded-lg border-2 cursor-pointer select-none transition-all flex items-center gap-3 ${
                    needsCms
                      ? "bg-slate-900/60 border-cyan-500 text-cyan-300"
                      : "bg-slate-950 border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={needsCms}
                    onChange={() => {}}
                    className="accent-cyan-500 cursor-pointer pointer-events-none"
                  />
                  <div className="font-mono text-xs">
                    <p className="font-bold text-white">Headless CMS Editor</p>
                    <p className="text-[10px] text-slate-500">Self-edit blogs / content live (+ $400)</p>
                  </div>
                </div>

                <div
                  onClick={() => setHasSlaSupport(!hasSlaSupport)}
                  className={`p-4 rounded-lg border-2 cursor-pointer select-none transition-all flex items-center gap-3 ${
                    hasSlaSupport
                      ? "bg-slate-900/60 border-cyan-500 text-cyan-300"
                      : "bg-slate-950 border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={hasSlaSupport}
                    onChange={() => {}}
                    className="accent-cyan-500 cursor-pointer pointer-events-none"
                  />
                  <div className="font-mono text-xs">
                    <p className="font-bold text-white">Weekly Maintenance Support</p>
                    <p className="text-[10px] text-slate-500">Proactive edge hosting security SLA (+ $450)</p>
                  </div>
                </div>

              </div>

              {/* Estimate Output Result Display Block */}
              <div className="bg-slate-900/70 border border-slate-850 p-6 rounded-lg text-center space-y-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  calculated strategic estimate range
                </span>
                
                <h4 className="text-3xl md:text-4xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  {calculateEstimatedInvestment()}
                </h4>

                <p className="text-slate-400 text-[11px] font-mono leading-relaxed max-w-lg mx-auto select-text">
                  Includes full static pre-rendered source files transfer, dynamic SEO structural configurations, custom graphics assets integrations, and local sitemap indexing requests.
                </p>

                <div className="pt-3 flex justify-center">
                  <button
                    onClick={() => {
                      setContactConcept(`Interactive project estimate: ${pagesCount} Pages, Components: ${needsAuth ? 'Auth, ' : ''}${needsDatabase ? 'Database, ' : ''}${needsCms ? 'Headless CMS, ' : ''}${hasSlaSupport ? 'SLA Security Service' : ''}. Target estimate: ${calculateEstimatedInvestment()}`);
                      const contactSection = document.getElementById("contact");
                      if (contactSection) contactSection.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-6 py-3 bg-cyan-500 text-slate-950 text-xs font-mono font-bold rounded-lg cursor-pointer hover:shadow-neon-cyan active:translate-y-0.5 transition-all"
                  >
                    PRE-ARRANGE DISCOVERY CONSULTATION
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION: STRUCTURED MILESTONES */}
      <section id="milestones" className="py-24 border-t border-slate-900 relative z-10 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 bg-cyan-950/60 text-cyan-400 border border-cyan-900 rounded-full font-mono text-xs tracking-wider uppercase">
            Onboarding Timelines
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
            Structured milestones.
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            From initial business exploration blueprinting to lightning-fast production publishing, look at how we orchestrate your client expansion cycle systematically.
          </p>
        </div>

        {/* Milestone Steps Timeline Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
          
          {/* Timeline background connectors */}
          <div className="absolute top-1/4 left-1/10 right-1/10 h-0.5 bg-gradient-to-r from-cyan-500/10 via-amber-500/20 to-cyan-500/10 hidden lg:block pointer-events-none" />

          {MILESTONES.map((mile) => (
            <div key={mile.step} className="bg-slate-950 p-6 rounded-xl border border-slate-900 relative space-y-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-amber-500 text-slate-950 flex items-center justify-center font-display font-black text-sm shadow-md">
                {mile.step}
              </div>

              <div>
                <h4 className="font-display font-bold text-white text-base leading-none mb-1.5">{mile.title}</h4>
                <p className="text-slate-400 text-xs font-sans leading-relaxed select-text">{mile.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: PROPOSAL CONTACT FORM INTAKE (Send a Proposal Request) */}
      <section id="contact" className="py-24 border-t border-slate-900 bg-slate-950/20 relative z-10 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#06080d] to-[#030408] border border-cyan-500/10 rounded-2xl p-6 md:p-12 relative shadow-2xl">
          
          <div className="text-center space-y-4 max-w-xl mx-auto mb-10">
            <h3 className="text-3xl font-display font-extrabold text-white tracking-tight">
              Send a Proposal Request
            </h3>
            <p className="text-slate-400 text-xs font-mono">
              Fill in your contact parameters. Let's arrange a secure virtual screen call to deliver your high-performance customer conversion engine.
            </p>
          </div>

          <form onSubmit={handleProposalSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 block font-medium">Business Owner Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Shreyash J."
                  className="w-full bg-slate-900/60 border border-slate-850 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 block font-medium">Professional Email address</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. shreyash@luxeclient.com"
                  className="w-full bg-slate-900/60 border border-slate-850 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 font-mono">
              <label className="text-xs text-slate-400 block font-medium">Core Brand Goals & Requirements (Optional)</label>
              <textarea
                value={contactConcept}
                onChange={(e) => setContactConcept(e.target.value)}
                placeholder="Details of your business goals, target niche, estimated budget, or a reference to your generated blueprint..."
                rows={4}
                className="w-full bg-slate-900/60 border border-slate-850 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              />
            </div>

            {contactResult && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-mono ${
                contactResult.success
                  ? "bg-green-950/40 border-green-900 text-green-300"
                  : "bg-red-950/40 border-red-900 text-red-300"
              }`}>
                <div className="shrink-0">
                  {contactResult.success ? <CheckCircle className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
                </div>
                <span>{contactResult.message}</span>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmittingContact}
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-display font-bold rounded-lg cursor-pointer disabled:opacity-50 tracking-wider shadow-lg shadow-cyan-500/10 hover:shadow-neon-cyan text-sm uppercase"
              >
                {isSubmittingContact ? "TRANSMITTING TO THE AGENCY CONCIERGE..." : "Send a Proposal"}
              </button>
            </div>
          </form>

        </div>
      </section>

      {/* FOOTER AREA */}
      <footer className="border-t border-slate-900 bg-[#020306] py-16 px-6 relative z-10 font-mono text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-amber-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#020306] rounded-[6px] flex items-center justify-center">
                  <span className="text-white font-extrabold text-xs">LD</span>
                </div>
              </div>
              <span className="font-display font-extrabold tracking-tight text-white">LUXE DIGITAL</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm">
              Helping high-growth small business owners secure premium online visibility, fast loading times, and instant local SEO dominance.
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="font-display font-semibold text-slate-200 uppercase tracking-widest">Agency Contacts</h5>
            <p className="text-slate-400 leading-normal">
              Agency Lead Director: Shreyash Javanajal<br />
              Developer Email: <a href={`mailto:${"javanjalshreyash1@gmail.com"}`} className="text-cyan-400 hover:underline">javanjalshreyash1@gmail.com</a><br />
              Studio Operations Base: India
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="font-display font-semibold text-slate-200 uppercase tracking-widest">Digital Capabilities</h5>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              We leverage hand-coded React templates, server-side dynamic Gemini-3.5 cognitive systems, headless CMS, and ultra-safe multi-region EDGE caches globally.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-slate-950/80 text-center text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Luxe Digital Agency. All rights and capabilities hand-coded perfectly.</p>
          <div className="flex space-x-6 text-slate-500">
            <span className="hover:text-cyan-400 transition-colors">Clean Assets</span>
            <span>•</span>
            <span className="hover:text-cyan-400 transition-colors">Fast Speed</span>
            <span>•</span>
            <span className="hover:text-cyan-400 transition-colors">High Conversion</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
