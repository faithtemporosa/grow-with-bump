export type AutomationCategory = 
  | "Email & Communication"
  | "Marketing & SEO"
  | "Lead Generation & Sales"
  | "Operations & Productivity"
  | "eCommerce & Product"
  | "Data & Analytics"
  | "Social Media Marketing"
  | "Content Creation"
  | "Research & Analysis"
  | "Sales & CRM";

export interface Automation {
  id: string;
  name: string;
  description: string;
  category: AutomationCategory;
  hoursSaved: number;
  monthlySavings: number;
  setupTime: string;
  roiLevel: "high" | "medium" | "low";
  tools: string[];
  thumbnail: string;
  features: string[];
  problemStatement: string;
  solution: string;
  useCases: string[];
  requirements: string[];
  workflowSteps: string[];
  workflowUrl?: string; // Optional n8n workflow link
  isN8NWorkflow?: boolean; // Flag for n8n templates
}

const baseAutomations: Automation[] = [
  {
    id: "email-ai-summarize",
    name: "AI-Powered Email Summarize + Auto-Reply",
    description: "Automatically processes incoming emails, summarizes them, classifies them, and generates intelligent replies.",
    category: "Email & Communication",
    hoursSaved: 30,
    monthlySavings: 2250,
    setupTime: "24-48 hours",
    roiLevel: "high",
    tools: ["Gmail", "DeepSeek R1", "GPT-4o-mini", "RAG"],
    thumbnail: "/placeholder.svg",
    features: [
      "Email summarization using DeepSeek R1",
      "Classification + drafting using GPT-4o-mini",
      "RAG knowledge-base aware replies",
      "Automatic response sending"
    ],
    problemStatement: "You waste 20-40 hours monthly manually reading, categorizing, and responding to emails.",
    solution: "AI automatically summarizes, classifies, and drafts intelligent responses based on your knowledge base.",
    useCases: [
      "Founders managing high-volume inboxes",
      "Sales teams with repetitive outreach",
      "Customer support automation"
    ],
    requirements: ["Gmail account", "API access", "Knowledge base (optional)"],
    workflowSteps: [
      "Email received",
      "AI summarizes content",
      "Classifies email type",
      "Generates context-aware reply",
      "Sends response automatically"
    ]
  },
  {
    id: "apple-shortcuts-ai",
    name: "Apple Shortcuts – AI Text Tools",
    description: "Backend AI text processor accessible from iPhone for translation, grammar fixes, and rewriting.",
    category: "Email & Communication",
    hoursSaved: 10,
    monthlySavings: 750,
    setupTime: "12-24 hours",
    roiLevel: "medium",
    tools: ["Apple Shortcuts", "OpenAI", "iOS"],
    thumbnail: "/placeholder.svg",
    features: [
      "Translate to Spanish/English",
      "Fix grammar automatically",
      "Rewrite shorter or longer",
      "Mobile-accessible AI"
    ],
    problemStatement: "You need quick AI text processing on mobile without switching apps constantly.",
    solution: "One-tap AI text tools directly from your iPhone shortcuts.",
    useCases: [
      "Mobile-first entrepreneurs",
      "Content creators on the go",
      "International communication"
    ],
    requirements: ["iPhone", "iOS Shortcuts app"],
    workflowSteps: [
      "Select text on iPhone",
      "Trigger shortcut",
      "AI processes text",
      "Returns result",
      "Paste anywhere"
    ]
  },
  {
    id: "seo-keyword-report",
    name: "Weekly SEO Keyword Report",
    description: "Automates SERP tracking & weekly insights with AI-powered trend analysis.",
    category: "Marketing & SEO",
    hoursSaved: 20,
    monthlySavings: 1500,
    setupTime: "24-48 hours",
    roiLevel: "high",
    tools: ["SERPBear", "AI Summary", "Baserow"],
    thumbnail: "/placeholder.svg",
    features: [
      "Fetches keyword rankings automatically",
      "AI summarizes trends",
      "Stores insights in Baserow",
      "Improvement suggestions"
    ],
    problemStatement: "Manual SEO tracking takes 5-10 hours per week with no actionable insights.",
    solution: "Automated tracking with AI-powered analysis and improvement recommendations.",
    useCases: [
      "Marketers tracking campaign performance",
      "SEO teams managing multiple sites",
      "Agencies reporting to clients"
    ],
    requirements: ["SERPBear account", "Baserow database"],
    workflowSteps: [
      "Fetch keyword data",
      "Analyze ranking changes",
      "Generate AI insights",
      "Store in database",
      "Send weekly report"
    ]
  },
  {
    id: "analytics-summary",
    name: "Umami Analytics → AI Summary",
    description: "Creates weekly marketing dashboards with page performance analysis.",
    category: "Data & Analytics",
    hoursSaved: 20,
    monthlySavings: 1500,
    setupTime: "24-48 hours",
    roiLevel: "high",
    tools: ["Umami", "Llama 3.1", "Baserow"],
    thumbnail: "/placeholder.svg",
    features: [
      "Pulls page performance data",
      "Summarizes using Llama 3.1",
      "Top pages + weekly comparison",
      "Automatic storage"
    ],
    problemStatement: "Analyzing weekly analytics takes hours and provides no clear action items.",
    solution: "AI automatically generates insights with actionable recommendations.",
    useCases: [
      "Marketing teams tracking campaigns",
      "Product managers analyzing features",
      "Content teams optimizing pages"
    ],
    requirements: ["Umami Analytics", "Baserow database"],
    workflowSteps: [
      "Pull analytics data",
      "AI analyzes trends",
      "Generate insights",
      "Compare week-over-week",
      "Store & share report"
    ]
  },
  {
    id: "product-video-generator",
    name: "eCommerce Product Video Generator",
    description: "Automatically generates animated product showcase videos using product URLs.",
    category: "eCommerce & Product",
    hoursSaved: 40,
    monthlySavings: 3000,
    setupTime: "48-72 hours",
    roiLevel: "high",
    tools: ["Gemini Veo 3.1", "Google Drive"],
    thumbnail: "/placeholder.svg",
    features: [
      "Scrapes product data from URL",
      "Generates vertical videos",
      "Uploads to Google Drive",
      "Ready for TikTok, ads, PDPs"
    ],
    problemStatement: "Creating product videos manually costs $100-200 per video and takes days.",
    solution: "Automated video generation from product URLs in minutes.",
    useCases: [
      "eCommerce stores launching products",
      "Dropshippers scaling content",
      "Social media ads automation"
    ],
    requirements: ["Product page URLs", "Google Drive"],
    workflowSteps: [
      "Input product URL",
      "Scrape product details",
      "Generate video with AI",
      "Upload to Drive",
      "Ready for distribution"
    ]
  },
  {
    id: "ai-lead-qualification",
    name: "AI Lead Qualification & Email Response",
    description: "Automatically classifies leads, summarizes intent, and generates personalized replies.",
    category: "Lead Generation & Sales",
    hoursSaved: 25,
    monthlySavings: 1875,
    setupTime: "24-48 hours",
    roiLevel: "high",
    tools: ["Gmail", "GPT-4", "CRM Integration"],
    thumbnail: "/placeholder.svg",
    features: [
      "Lead scoring and classification",
      "Intent analysis",
      "Personalized reply generation",
      "CRM note logging"
    ],
    problemStatement: "Sales teams spend hours qualifying leads and writing custom responses.",
    solution: "AI automatically qualifies and responds to leads with personalized messages.",
    useCases: [
      "Sales teams handling inbound leads",
      "Agencies managing prospects",
      "B2B sales automation"
    ],
    requirements: ["Email access", "CRM system"],
    workflowSteps: [
      "Lead inquiry received",
      "AI qualifies lead",
      "Analyzes intent",
      "Generates personalized reply",
      "Logs to CRM"
    ]
  },
  {
    id: "notion-rag-assistant",
    name: "Website AI Assistant — RAG From Live Notion",
    description: "Real-time syncing chatbot that knows your living knowledge base.",
    category: "Operations & Productivity",
    hoursSaved: 30,
    monthlySavings: 2250,
    setupTime: "48-72 hours",
    roiLevel: "high",
    tools: ["Notion", "Supabase", "Vector DB", "RAG"],
    thumbnail: "/placeholder.svg",
    features: [
      "Real-time Notion → Supabase sync",
      "Auto-upsert embeddings every minute",
      "Context-aware chatbot responses",
      "Living knowledge base"
    ],
    problemStatement: "Customer support teams answer the same questions repeatedly from static docs.",
    solution: "AI chatbot that syncs with your live Notion workspace for always-updated answers.",
    useCases: [
      "Customer support automation",
      "Internal knowledge management",
      "Product documentation assistants"
    ],
    requirements: ["Notion workspace", "Supabase account"],
    workflowSteps: [
      "Sync Notion content",
      "Generate embeddings",
      "Store in vector DB",
      "Query receives context",
      "AI generates response"
    ]
  },
  {
    id: "folder-organizer-ai",
    name: "Auto-Organize Local Files Using AI",
    description: "Automatically sorts and organizes local files using AI categorization.",
    category: "Operations & Productivity",
    hoursSaved: 15,
    monthlySavings: 1125,
    setupTime: "12-24 hours",
    roiLevel: "medium",
    tools: ["Local File System", "AI Classifier"],
    thumbnail: "/placeholder.svg",
    features: [
      "Monitors folder automatically",
      "AI categorizes files",
      "Executes move commands",
      "Creates new folders as needed"
    ],
    problemStatement: "Hours wasted manually organizing downloads, documents, and project files.",
    solution: "AI automatically categorizes and organizes files into logical folder structures.",
    useCases: [
      "Designers managing assets",
      "Developers organizing projects",
      "Anyone with messy downloads"
    ],
    requirements: ["Local folder access"],
    workflowSteps: [
      "Monitor target folder",
      "AI analyzes files",
      "Categorize by type/content",
      "Move to organized folders",
      "Create new folders if needed"
    ]
  },
  {
    id: "workflow-docs-generator",
    name: "Documentation Auto-Generator",
    description: "Generates live documentation for all internal workflows automatically.",
    category: "Operations & Productivity",
    hoursSaved: 20,
    monthlySavings: 1500,
    setupTime: "24-48 hours",
    roiLevel: "medium",
    tools: ["n8n", "Mermaid", "Documentation System"],
    thumbnail: "/placeholder.svg",
    features: [
      "Auto-generates workflow docs",
      "Creates Mermaid charts",
      "Extracts workflow metadata",
      "Editable output"
    ],
    problemStatement: "Documentation falls out of sync and takes hours to maintain manually.",
    solution: "Automatically generate and update workflow documentation from your automation tools.",
    useCases: [
      "Agencies documenting processes",
      "Dev teams maintaining wikis",
      "Automation companies scaling"
    ],
    requirements: ["n8n workflows or similar"],
    workflowSteps: [
      "Connect to workflow tools",
      "Extract metadata",
      "Generate documentation",
      "Create visual diagrams",
      "Auto-update on changes"
    ]
  }
];

// N8N Workflow Templates - HIGH ROI ADDITIONS
const n8nWorkflows: Automation[] = [
  {
    id: "n8n-social-content-publisher",
    name: "Automated Social Media Content Publisher",
    description: "AI-powered content creation and publishing across Twitter, Instagram, Facebook, LinkedIn, Threads, and YouTube Shorts. Uses OpenAI GPT-4 and LangChain to generate posts and images automatically.",
    category: "Social Media Marketing",
    hoursSaved: 80,
    monthlySavings: 6000,
    setupTime: "48-72 hours",
    roiLevel: "high",
    tools: ["OpenAI GPT-4", "LangChain", "Pollinations.ai", "Google Docs"],
    thumbnail: "/placeholder.svg",
    features: [
      "Multi-platform publishing (6+ platforms)",
      "AI-generated content with GPT-4",
      "Automated image creation",
      "Human approval workflow",
      "Dynamic prompt composition"
    ],
    problemStatement: "Creating and posting unique content across multiple social platforms takes 80+ hours per month.",
    solution: "AI automatically generates platform-specific content, creates matching images, and publishes with approval workflow.",
    useCases: [
      "Social media managers juggling multiple accounts",
      "Brand marketers maintaining consistent presence",
      "Content creators automating distribution"
    ],
    requirements: ["Social media accounts", "OpenAI API", "Google Docs"],
    workflowSteps: [
      "AI composes content from prompts",
      "Generates platform-specific posts",
      "Creates matching images",
      "Sends for approval",
      "Auto-publishes approved content"
    ],
    workflowUrl: "https://drive.google.com/file/d/1WB71Pdj3pU4mns3xrBZzWwgrLtthd4p2/view?usp=drivesdk",
    isN8NWorkflow: true
  },
  {
    id: "n8n-ai-social-video-creator",
    name: "AI Social Video Generator & Auto Posting",
    description: "Complete video automation using Telegram, GPT-4, Kling AI, and Cloudinary. Creates AI videos with voice-over and captions, then auto-publishes to 9+ social platforms.",
    category: "Content Creation",
    hoursSaved: 75,
    monthlySavings: 5625,
    setupTime: "48-72 hours",
    roiLevel: "high",
    tools: ["GPT-4", "Kling AI", "Cloudinary", "Blotato", "Telegram"],
    thumbnail: "/placeholder.svg",
    features: [
      "AI video generation with voice-over",
      "Auto-publish to 9 platforms",
      "Telegram control interface",
      "Caption generation",
      "Cloudinary asset management"
    ],
    problemStatement: "Creating video content for social media takes 75+ hours monthly with design, editing, and posting.",
    solution: "AI generates complete videos with voiceover and captions, then automatically publishes across all platforms.",
    useCases: [
      "Video marketers scaling content production",
      "Brands maintaining video presence",
      "Agencies managing multiple clients"
    ],
    requirements: ["Telegram bot", "Kling AI API", "Cloudinary account", "Social accounts"],
    workflowSteps: [
      "Receive prompt via Telegram",
      "AI generates video with Kling",
      "Add voice-over and captions",
      "Upload to Cloudinary",
      "Auto-publish to 9 platforms"
    ],
    workflowUrl: "https://drive.google.com/file/d/1eBclIzL_hJD6HszZzEumi20Rmvz_j2rQ/view?usp=drivesdk",
    isN8NWorkflow: true
  },
  {
    id: "n8n-social-video-multi-platform",
    name: "AI Social Video Auto-Creation & Multi-Platform Posting",
    description: "Create videos from prompts or images using AI, merge voice-over and captions, save to Google Sheets, and auto-publish to 9 social platforms.",
    category: "Content Creation",
    hoursSaved: 70,
    monthlySavings: 5250,
    setupTime: "48-72 hours",
    roiLevel: "high",
    tools: ["GPT-4", "Piapi", "Blotato", "Google Sheets"],
    thumbnail: "/placeholder.svg",
    features: [
      "9-platform auto-publishing",
      "Voice-over integration",
      "Caption automation",
      "Google Sheets tracking",
      "Image-to-video conversion"
    ],
    problemStatement: "Managing video content creation and distribution across 9 platforms consumes 70+ hours monthly.",
    solution: "Automated video creation pipeline from concept to multi-platform distribution with tracking.",
    useCases: [
      "Multi-platform content creators",
      "Marketing teams scaling video output",
      "Social media agencies"
    ],
    requirements: ["GPT-4 API", "Social platform accounts", "Google Sheets"],
    workflowSteps: [
      "Input prompt or image",
      "AI creates video",
      "Add voice-over and captions",
      "Track in Google Sheets",
      "Publish to 9 platforms"
    ],
    workflowUrl: "https://drive.google.com/file/d/1uXtwjVqKp_GjCJlC2GBDf_SGDxmfinGg/view?usp=drivesdk",
    isN8NWorkflow: true
  },
  {
    id: "n8n-tiktok-reels-generator",
    name: "AI TikTok/YouTube Shorts Reel Generator",
    description: "Automate POV short-form video creation for TikTok, YouTube Shorts, and Reels. Uses OpenAI for scripts, PiAPI for AI visuals, Eleven Labs for voiceover, and Creatomate for rendering.",
    category: "Content Creation",
    hoursSaved: 65,
    monthlySavings: 4875,
    setupTime: "48-72 hours",
    roiLevel: "high",
    tools: ["OpenAI", "PiAPI", "Eleven Labs", "Creatomate", "Google Sheets"],
    thumbnail: "/placeholder.svg",
    features: [
      "AI script generation",
      "Professional voiceover (Eleven Labs)",
      "AI image & video generation",
      "Automated video rendering",
      "Google Sheets data management"
    ],
    problemStatement: "Creating engaging short-form videos takes 65+ hours monthly with scripting, visuals, and editing.",
    solution: "End-to-end automation generates scripts, visuals, voiceovers, and renders professional short-form content.",
    useCases: [
      "TikTok content creators",
      "YouTube Shorts channels",
      "Instagram Reels marketers"
    ],
    requirements: ["OpenAI API", "Eleven Labs", "PiAPI", "Creatomate"],
    workflowSteps: [
      "AI generates script",
      "Create AI visuals",
      "Generate voiceover",
      "Render video",
      "Export for publishing"
    ],
    workflowUrl: "https://drive.google.com/file/d/1zoeKCSxrEujMirkM7o-klLO0lbHKmsIt/view?usp=drivesdk",
    isN8NWorkflow: true
  },
  {
    id: "n8n-social-content-prompt-composer",
    name: "Social Media Content Publisher & Prompt Composer",
    description: "Advanced content automation for TikTok, Instagram, Facebook, Twitter, LinkedIn, and Threads. Uses GPT-4o-mini, Langchain, and Pollinations.ai for complete content creation pipeline.",
    category: "Social Media Marketing",
    hoursSaved: 60,
    monthlySavings: 4500,
    setupTime: "48-72 hours",
    roiLevel: "high",
    tools: ["GPT-4o-mini", "Langchain", "Pollinations.ai", "imgbb", "Gmail"],
    thumbnail: "/placeholder.svg",
    features: [
      "6-platform automation",
      "AI content generation",
      "Image hosting (imgbb)",
      "Gmail approval workflow",
      "Google Docs prompt storage"
    ],
    problemStatement: "Managing content creation and approval across 6 platforms takes 60+ hours monthly.",
    solution: "Intelligent automation handles content generation, approval workflows, and multi-platform publishing.",
    useCases: [
      "Marketing teams with approval processes",
      "Agencies managing client content",
      "Brands maintaining compliance"
    ],
    requirements: ["Social accounts", "Gmail", "Google Docs", "OpenAI API"],
    workflowSteps: [
      "Compose prompts in Google Docs",
      "AI generates content",
      "Create and host images",
      "Email approval workflow",
      "Auto-post approved content"
    ],
    workflowUrl: "https://drive.google.com/file/d/1-j5KvlItLQpRevZRnscVqu5xBXl-nixa/view?usp=drivesdk",
    isN8NWorkflow: true
  },
  {
    id: "n8n-telegram-ai-assistant",
    name: "AI-Powered Telegram Assistant",
    description: "Complete AI assistant on Telegram integrating GPT-4, Google Calendar, Gmail, and Baserow. Handles voice/text inputs, email summaries, calendar events, and task management.",
    category: "Operations & Productivity",
    hoursSaved: 50,
    monthlySavings: 3750,
    setupTime: "36-48 hours",
    roiLevel: "high",
    tools: ["GPT-4", "Telegram", "Google Calendar", "Gmail", "Baserow"],
    thumbnail: "/placeholder.svg",
    features: [
      "Voice transcription",
      "Email summarization",
      "Calendar integration",
      "Task management (Baserow)",
      "Telegram interface"
    ],
    problemStatement: "Managing emails, calendar, and tasks separately wastes 50+ hours monthly and causes missed opportunities.",
    solution: "Unified AI assistant handles all communication, scheduling, and task management through one Telegram interface.",
    useCases: [
      "Busy executives managing multiple channels",
      "Remote workers coordinating tasks",
      "Entrepreneurs optimizing productivity"
    ],
    requirements: ["Telegram account", "Gmail", "Google Calendar", "Baserow"],
    workflowSteps: [
      "Receive voice/text input",
      "Transcribe and process",
      "Fetch relevant data",
      "AI generates response",
      "Execute actions automatically"
    ],
    workflowUrl: "https://drive.google.com/file/d/1X68iLPpkSlxL4YoZdWTjLjglxzO0on12/view?usp=drivesdk",
    isN8NWorkflow: true
  },
  {
    id: "n8n-ai-research-report-generator",
    name: "AI-Powered Automated Research Report Generator",
    description: "Automated research reports using GPT-4, Wikipedia, NewsAPI, Google Search, and SerpApi. Generates professional PDFs and delivers via Gmail and Telegram.",
    category: "Research & Analysis",
    hoursSaved: 45,
    monthlySavings: 3375,
    setupTime: "36-48 hours",
    roiLevel: "high",
    tools: ["GPT-4", "Wikipedia", "NewsAPI", "Google Search", "SerpApi", "PDFShift"],
    thumbnail: "/placeholder.svg",
    features: [
      "Multi-source research",
      "AI summarization (GPT-4)",
      "PDF generation",
      "Email & Telegram delivery",
      "Scholarly paper integration"
    ],
    problemStatement: "Manual research and report writing takes 45+ hours monthly with inconsistent quality.",
    solution: "AI automatically gathers data from multiple sources, synthesizes findings, and delivers professional reports.",
    useCases: [
      "Analysts producing regular reports",
      "Consultants researching clients",
      "Marketing teams tracking trends"
    ],
    requirements: ["GPT-4 API", "NewsAPI", "Google API", "SerpApi"],
    workflowSteps: [
      "Define research query",
      "AI searches multiple sources",
      "Summarize and synthesize",
      "Generate PDF report",
      "Deliver via email/Telegram"
    ],
    workflowUrl: "https://drive.google.com/file/d/1pl7u39pcJz0kTy9hjV-PR3Fc5Z0PZm_o/view?usp=drivesdk",
    isN8NWorkflow: true
  },
  {
    id: "n8n-sales-meeting-follow-up",
    name: "AI-Driven Sales Meeting Follow-Up Scheduler",
    description: "Automate sales follow-ups using Google Calendar and Gmail. GPT-4 AI agents suggest and book meeting slots with human approval for final booking.",
    category: "Sales & CRM",
    hoursSaved: 35,
    monthlySavings: 2625,
    setupTime: "24-36 hours",
    roiLevel: "medium",
    tools: ["GPT-4", "Google Calendar", "Gmail"],
    thumbnail: "/placeholder.svg",
    features: [
      "Auto follow-up detection",
      "AI meeting scheduling",
      "Email interaction tracking",
      "Calendar integration",
      "Human approval workflow"
    ],
    problemStatement: "Sales follow-up and scheduling takes 35+ hours monthly with frequent missed opportunities.",
    solution: "AI monitors conversations, suggests optimal meeting times, and automates booking with approval workflow.",
    useCases: [
      "Sales teams managing multiple prospects",
      "Account managers scheduling check-ins",
      "Business development reps"
    ],
    requirements: ["Gmail", "Google Calendar", "GPT-4 API"],
    workflowSteps: [
      "Monitor email interactions",
      "Detect follow-up opportunities",
      "AI suggests meeting times",
      "Get human approval",
      "Auto-book and notify"
    ],
    workflowUrl: "https://drive.google.com/file/d/1jrBj51g5O9jdDaNBZWVXCsZiEjyOWH-x/view?usp=drivesdk",
    isN8NWorkflow: true
  },
  {
    id: "n8n-youtube-video-summaries",
    name: "YouTube Video Summaries & Transcripts via Gemini API",
    description: "Extract YouTube transcripts, summaries, scene descriptions, and social media clips using Google Gemini API. Customize prompts for versatile content analysis.",
    category: "Content Creation",
    hoursSaved: 25,
    monthlySavings: 1875,
    setupTime: "24-36 hours",
    roiLevel: "medium",
    tools: ["Google Gemini API", "YouTube API"],
    thumbnail: "/placeholder.svg",
    features: [
      "Auto transcript extraction",
      "AI video summarization",
      "Scene descriptions",
      "Social clip generation",
      "Customizable prompts"
    ],
    problemStatement: "Manually transcribing and analyzing video content takes 25+ hours monthly.",
    solution: "Automated extraction and AI analysis of YouTube videos with customizable output formats.",
    useCases: [
      "Content repurposers extracting clips",
      "Marketers analyzing competitor videos",
      "Researchers documenting video content"
    ],
    requirements: ["YouTube API", "Google Gemini API"],
    workflowSteps: [
      "Extract YouTube transcript",
      "AI analyzes content",
      "Generate summaries",
      "Create scene descriptions",
      "Export formatted output"
    ],
    workflowUrl: "https://drive.google.com/file/d/1-vX6sZJ_HxPvMOvmWG97bpdV__eBXNmr/view?usp=drivesdk",
    isN8NWorkflow: true
  }
];

// Merge n8n workflows with existing automations - n8n first for highest ROI display
export const automations: Automation[] = [...n8nWorkflows, ...baseAutomations];

export const categories: AutomationCategory[] = [
  "Social Media Marketing",
  "Content Creation",
  "Email & Communication",
  "Marketing & SEO",
  "Lead Generation & Sales",
  "Operations & Productivity",
  "eCommerce & Product",
  "Data & Analytics",
  "Research & Analysis",
  "Sales & CRM"
];
