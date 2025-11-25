import type { Automation, AutomationCategory } from "@/data/automations";

// CSV data is loaded from the public directory at runtime
let cachedAutomations: Automation[] | null = null;

/**
 * Converts technical terms to generalized business-friendly terms
 */
function generalizeRequirement(requirement: string): string {
  const technicalToGeneral: Record<string, string> = {
    'API': 'Account access',
    'API key': 'Account credentials',
    'API access': 'Account access',
    'webhook': 'Automated notifications',
    'OAuth': 'Account connection',
    'database': 'Data storage',
    'SQL': 'Data management',
    'REST API': 'Service integration',
    'GraphQL': 'Service integration',
    'SDK': 'Integration tools',
    'SMTP': 'Email service',
    'SSL': 'Secure connection',
    'JSON': 'Data format',
    'XML': 'Data format',
    'cron job': 'Scheduled tasks',
    'server': 'Hosting service',
    'domain': 'Website address',
    'DNS': 'Website settings',
    'CDN': 'Content delivery',
    'S3': 'File storage',
    'bucket': 'Storage space',
    'endpoint': 'Connection point',
    'JWT': 'Authentication token',
    'token': 'Access credential'
  };

  let generalized = requirement;
  
  // Replace technical terms (case-insensitive)
  Object.entries(technicalToGeneral).forEach(([technical, general]) => {
    const regex = new RegExp(`\\b${technical}\\b`, 'gi');
    generalized = generalized.replace(regex, general);
  });
  
  return generalized;
}

/**
 * Parses the automations catalog CSV and converts it to Automation objects
 */
export async function parseAutomationsCatalog(): Promise<Automation[]> {
  if (cachedAutomations) {
    return cachedAutomations;
  }

  try {
    // In production, the CSV should be in public folder
    const response = await fetch('/automations-catalog.csv');
    const catalogCSV = await response.text();
    
    const lines = catalogCSV.split('\n');
    const automations: Automation[] = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line with proper handling of quoted fields
      const fields = parseCSVLine(line);
      
      if (fields.length < 17) continue; // Skip incomplete rows
      
      const [
        id,
        name,
        description,
        category,
        hoursSaved,
        monthlySavings,
        setupTime,
        priceAsPerROI,
        roiLevel,
        actualPrice,
        tools,
        features,
        problemStatement,
        solution,
        useCases,
        requirements,
        workflowUrl
      ] = fields;
      
      if (!id || !name) continue; // Skip rows without essential data
      
      automations.push({
        id: id.trim(),
        name: name.trim(),
        description: description.trim(),
        category: category.trim() as AutomationCategory,
        hoursSaved: parseInt(hoursSaved) || 0,
        monthlySavings: parseInt(monthlySavings) || 0,
        setupTime: setupTime.trim(),
        roiLevel: (roiLevel.trim() as "high" | "medium" | "low") || "medium",
        tools: tools.split(',').map(t => t.trim()).filter(Boolean),
        thumbnail: "/placeholder.svg",
        features: features.split(';').map(f => f.trim()).filter(Boolean),
        problemStatement: problemStatement.trim(),
        solution: solution.trim(),
        useCases: useCases.split(';').map(u => u.trim()).filter(Boolean),
        requirements: requirements.split(';').map(r => generalizeRequirement(r.trim())).filter(Boolean),
        workflowSteps: [], // We don't have workflow steps in the CSV
        workflowUrl: workflowUrl.trim() || undefined,
        isN8NWorkflow: true
      });
    }
    
    cachedAutomations = automations;
    return automations;
  } catch (error) {
    console.error('Failed to load automations catalog:', error);
    return [];
  }
}

/**
 * Parses a CSV line handling quoted fields properly
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Field separator
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  // Add the last field
  fields.push(currentField);
  
  return fields;
}
