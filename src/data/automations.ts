// Automations are loaded from CSV at runtime
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
  workflowUrl?: string;
  isN8NWorkflow?: boolean;
}

// Automations will be loaded dynamically from CSV
export let automations: Automation[] = [];

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

// Load automations from CSV
import { parseAutomationsCatalog } from "@/utils/parseAutomationsCatalog";

parseAutomationsCatalog().then(data => {
  automations.length = 0;
  automations.push(...data);
});
