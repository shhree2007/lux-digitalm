export interface PageStructure {
  page: string;
  purpose: string;
  suggestedSections: string[];
}

export interface InteractiveFeature {
  feature: string;
  description: string;
  conversionBenefit: string;
}

export interface TechArchitecture {
  rendering: string;
  cms: string;
  hosting: string;
  speedOptimization: string;
}

export interface SEOStrategy {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  localSeoAction: string;
  blogIdeas: string[];
}

export interface WebsiteBlueprint {
  businessName: string;
  businessCategory: string;
  brandPhilosophy: string;
  siteMap: PageStructure[];
  interactiveFeatures: InteractiveFeature[];
  techArchitecture: TechArchitecture;
  seoStrategy: SEOStrategy;
  estimatedTimelineDays: number;
  targetInvestmentEstimate: string;
  error?: string;
}

export interface ProposalSubmission {
  id: string;
  name: string;
  email: string;
  businessConcept: string;
  createdAt: string;
}
