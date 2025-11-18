// Import n8n workflows for conversion
import { allN8NWorkflows } from "./n8n-workflows";
import { convertN8NWorkflowToAutomation } from "@/utils/convertN8NToAutomation";

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

// Convert all n8n workflows to Automation format
const n8nWorkflows: Automation[] = allN8NWorkflows.map(convertN8NWorkflowToAutomation);

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
