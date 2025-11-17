// N8N Workflow Templates - Organized by Category and ROI
export interface N8NWorkflow {
  id: string;
  name: string;
  description: string;
  category: AutomationCategory;
  price: number;
  hoursSaved: number;
  roiLevel: "high" | "medium" | "standard";
  features: string[];
  url: string;
  thumbnail?: string;
}

export type AutomationCategory =
  | "Social Media Marketing"
  | "Email Marketing"
  | "Operations"
  | "Content Creation"
  | "Sales & CRM"
  | "Research & Analysis";

export const n8nWorkflows: N8NWorkflow[] = [
  // HIGHEST ROI - Social Media Marketing Workflows
  {
    id: "social-content-publisher",
    name: "Automated Social Media Content Publisher",
    description: "AI-powered content creation and publishing across Twitter, Instagram, Facebook, LinkedIn, Threads, and YouTube Shorts. Uses OpenAI GPT-4 and LangChain to generate posts and images automatically.",
    category: "Social Media Marketing",
    price: 799,
    hoursSaved: 80,
    roiLevel: "high",
    features: [
      "Multi-platform publishing (6+ platforms)",
      "AI-generated content with GPT-4",
      "Automated image creation",
      "Human approval workflow",
      "Dynamic prompt composition"
    ],
    url: "https://drive.google.com/file/d/1WB71Pdj3pU4mns3xrBZzWwgrLtthd4p2/view?usp=drivesdk"
  },
  {
    id: "ai-social-video-creator",
    name: "AI Social Video Generator & Auto Posting",
    description: "Complete video automation using Telegram, GPT-4, Kling AI, and Cloudinary. Creates AI videos with voice-over and captions, then auto-publishes to 9+ social platforms.",
    category: "Content Creation",
    price: 999,
    hoursSaved: 75,
    roiLevel: "high",
    features: [
      "AI video generation with voice-over",
      "Auto-publish to 9 platforms",
      "Telegram control interface",
      "Caption generation",
      "Cloudinary asset management"
    ],
    url: "https://drive.google.com/file/d/1eBclIzL_hJD6HszZzEumi20Rmvz_j2rQ/view?usp=drivesdk"
  },
  {
    id: "social-video-multi-platform",
    name: "AI Social Video Auto-Creation & Multi-Platform Posting",
    description: "Create videos from prompts or images using AI, merge voice-over and captions, save to Google Sheets, and auto-publish to Instagram, YouTube, TikTok, Facebook, Threads, Twitter, LinkedIn, Bluesky, Pinterest.",
    category: "Content Creation",
    price: 899,
    hoursSaved: 70,
    roiLevel: "high",
    features: [
      "9-platform auto-publishing",
      "Voice-over integration",
      "Caption automation",
      "Google Sheets tracking",
      "Image-to-video conversion"
    ],
    url: "https://drive.google.com/file/d/1uXtwjVqKp_GjCJlC2GBDf_SGDxmfinGg/view?usp=drivesdk"
  },
  {
    id: "tiktok-reels-generator",
    name: "AI TikTok/YouTube Shorts Reel Generator",
    description: "Automate POV short-form video creation for TikTok, YouTube Shorts, and Reels. Uses OpenAI for scripts, PiAPI for AI visuals, Eleven Labs for voiceover, and Creatomate for rendering.",
    category: "Content Creation",
    price: 749,
    hoursSaved: 65,
    roiLevel: "high",
    features: [
      "AI script generation",
      "Professional voiceover (Eleven Labs)",
      "AI image & video generation",
      "Automated video rendering",
      "Google Sheets data management"
    ],
    url: "https://drive.google.com/file/d/1zoeKCSxrEujMirkM7o-klLO0lbHKmsIt/view?usp=drivesdk"
  },
  {
    id: "social-content-prompt-composer",
    name: "Social Media Content Publisher & Prompt Composer",
    description: "Advanced content automation for TikTok, Instagram, Facebook, Twitter, LinkedIn, and Threads. Uses GPT-4o-mini, Langchain, and Pollinations.ai for complete content creation pipeline.",
    category: "Social Media Marketing",
    price: 699,
    hoursSaved: 60,
    roiLevel: "high",
    features: [
      "6-platform automation",
      "AI content generation",
      "Image hosting (imgbb)",
      "Gmail approval workflow",
      "Google Docs prompt storage"
    ],
    url: "https://drive.google.com/file/d/1-j5KvlItLQpRevZRnscVqu5xBXl-nixa/view?usp=drivesdk"
  },

  // HIGH ROI - Email & Communication
  {
    id: "telegram-ai-assistant",
    name: "AI-Powered Telegram Assistant",
    description: "Complete AI assistant on Telegram integrating GPT-4, Google Calendar, Gmail, and Baserow. Handles voice/text inputs, email summaries, calendar events, and task management.",
    category: "Operations",
    price: 649,
    hoursSaved: 50,
    roiLevel: "high",
    features: [
      "Voice transcription",
      "Email summarization",
      "Calendar integration",
      "Task management (Baserow)",
      "Telegram interface"
    ],
    url: "https://drive.google.com/file/d/1X68iLPpkSlxL4YoZdWTjLjglxzO0on12/view?usp=drivesdk"
  },

  // HIGH ROI - Research & Content
  {
    id: "ai-research-report-generator",
    name: "AI-Powered Automated Research Report Generator",
    description: "Automated research reports using GPT-4, Wikipedia, NewsAPI, Google Search, and SerpApi. Generates professional PDFs and delivers via Gmail and Telegram.",
    category: "Research & Analysis",
    price: 599,
    hoursSaved: 45,
    roiLevel: "high",
    features: [
      "Multi-source research",
      "AI summarization (GPT-4)",
      "PDF generation",
      "Email & Telegram delivery",
      "Scholarly paper integration"
    ],
    url: "https://drive.google.com/file/d/1pl7u39pcJz0kTy9hjV-PR3Fc5Z0PZm_o/view?usp=drivesdk"
  },

  // MEDIUM ROI - Sales & CRM
  {
    id: "sales-meeting-follow-up",
    name: "AI-Driven Sales Meeting Follow-Up Scheduler",
    description: "Automate sales follow-ups using Google Calendar and Gmail. GPT-4 AI agents suggest and book meeting slots with human approval for final booking.",
    category: "Sales & CRM",
    price: 549,
    hoursSaved: 35,
    roiLevel: "medium",
    features: [
      "Auto follow-up detection",
      "AI meeting scheduling",
      "Email interaction tracking",
      "Calendar integration",
      "Human approval workflow"
    ],
    url: "https://drive.google.com/file/d/1jrBj51g5O9jdDaNBZWVXCsZiEjyOWH-x/view?usp=drivesdk"
  },

  // MEDIUM ROI - Content Analysis
  {
    id: "youtube-video-summaries",
    name: "YouTube Video Summaries & Transcripts via Gemini API",
    description: "Extract YouTube transcripts, summaries, scene descriptions, and social media clips using Google Gemini API. Customize prompts for versatile content analysis.",
    category: "Content Creation",
    price: 399,
    hoursSaved: 25,
    roiLevel: "medium",
    features: [
      "Auto transcript extraction",
      "AI video summarization",
      "Scene descriptions",
      "Social clip generation",
      "Customizable prompts"
    ],
    url: "https://drive.google.com/file/d/1-vX6sZJ_HxPvMOvmWG97bpdV__eBXNmr/view?usp=drivesdk"
  },

  // STANDARD ROI - Reference & Learning
  {
    id: "n8n-reference-library",
    name: "n8n AI & App Node Reference Library",
    description: "Comprehensive workflow showcasing various AI nodes (OpenAI, Langchain, Anthropic, Google Gemini) and app integrations. Visual reference for workflow building.",
    category: "Operations",
    price: 299,
    hoursSaved: 15,
    roiLevel: "standard",
    features: [
      "AI node examples",
      "App integration samples",
      "Google Suite connections",
      "Visual reference guide",
      "Workflow templates"
    ],
    url: "https://drive.google.com/file/d/1e21TLDoXfHjGAzWYrkULaWEJpvBOnM3b/view?usp=drivesdk"
  }
];

export const categories: AutomationCategory[] = [
  "Social Media Marketing",
  "Email Marketing",
  "Operations",
  "Content Creation",
  "Sales & CRM",
  "Research & Analysis"
];

// Get workflows by ROI level (high, medium, standard)
export function getWorkflowsByROI(roiLevel: "high" | "medium" | "standard") {
  return n8nWorkflows.filter(w => w.roiLevel === roiLevel);
}

// Get highest ROI workflows for homepage display
export function getHighestROIWorkflows(limit: number = 6) {
  return n8nWorkflows
    .sort((a, b) => b.hoursSaved - a.hoursSaved)
    .slice(0, limit);
}

// Get workflows by category
export function getWorkflowsByCategory(category: AutomationCategory) {
  return n8nWorkflows.filter(w => w.category === category);
}
