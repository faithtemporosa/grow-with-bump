import type { Automation, AutomationCategory } from "@/data/automations";

// CSV data is loaded from the public directory at runtime
let cachedAutomations: Automation[] | null = null;

/**
 * Converts technical terms to generalized business-friendly terms
 * Focus: Show only account/service names without technical jargon
 */
function generalizeRequirement(requirement: string): string {
  let generalized = requirement;
  
  // Step 1: Remove all technical suffixes and prefixes
  generalized = generalized
    // Remove API-related terms
    .replace(/\b(API|api)\s*(key|keys|access|token|tokens|credentials?|endpoint|integration|connection)\b/gi, '')
    .replace(/\b(API|api)\b/gi, '')
    // Remove authentication terms
    .replace(/\b(OAuth|OAuth2|authentication|auth|JWT|bearer)\s*(token|access|key)?\b/gi, '')
    // Remove technical action words
    .replace(/\b(access|credentials?|token|tokens|key|keys|integration|connection|endpoint|webhook|webhooks)\s*to\b/gi, '')
    .replace(/\b(with|using|via|through)\s+(API|api|OAuth|authentication|credentials?|token|access)\b/gi, '')
    // Remove version numbers
    .replace(/\bv\d+(\.\d+)*\b/g, '')
    // Remove HTTP methods
    .replace(/\b(GET|POST|PUT|DELETE|PATCH|REST|RESTful)\b/gi, '')
    // Remove technical prefixes
    .replace(/\b(developer|admin|business|enterprise)\s+(API|api|account|access|key|token)\b/gi, '$1')
    // Remove standalone technical terms
    .replace(/\b(webhook|webhooks|SDK|SMTP|IMAP|POP3|SSL|TLS|HTTPS?|JSON|XML|CSV|cron|endpoint|URL|URI)\b/gi, '')
    // Remove database terms
    .replace(/\b(database|SQL|MySQL|PostgreSQL|MongoDB|Redis)\b/gi, 'data storage')
    // Remove cloud service technical terms
    .replace(/\b(server|hosting|domain|DNS|CDN|S3|bucket)\b/gi, '')
    // Clean up extra spaces and punctuation
    .replace(/\s+/g, ' ')
    .replace(/\s*[,;]\s*/g, ', ')
    .replace(/\s*\.\s*$/g, '')
    .trim();
  
  // Step 2: Convert remaining platform names to simple "Platform account" format
  const platformPatterns = [
    { pattern: /\b(TikTok|tiktok)\b/gi, replacement: 'TikTok account' },
    { pattern: /\b(Instagram|instagram)\b/gi, replacement: 'Instagram account' },
    { pattern: /\b(Facebook|facebook)\b/gi, replacement: 'Facebook account' },
    { pattern: /\b(Twitter|twitter|X)\b/gi, replacement: 'Twitter account' },
    { pattern: /\b(LinkedIn|linkedin)\b/gi, replacement: 'LinkedIn account' },
    { pattern: /\b(YouTube|youtube)\b/gi, replacement: 'YouTube account' },
    { pattern: /\b(Google|google)\s*(Cloud|Analytics|Ads|Drive|Sheets|Docs)?\b/gi, replacement: 'Google account' },
    { pattern: /\b(Slack|slack)\b/gi, replacement: 'Slack account' },
    { pattern: /\b(Stripe|stripe)\b/gi, replacement: 'Stripe account' },
    { pattern: /\b(PayPal|paypal)\b/gi, replacement: 'PayPal account' },
    { pattern: /\b(Shopify|shopify)\b/gi, replacement: 'Shopify account' },
    { pattern: /\b(HubSpot|hubspot)\b/gi, replacement: 'HubSpot account' },
    { pattern: /\b(Salesforce|salesforce)\b/gi, replacement: 'Salesforce account' },
    { pattern: /\b(Mailchimp|mailchimp)\b/gi, replacement: 'Mailchimp account' },
    { pattern: /\b(Zapier|zapier)\b/gi, replacement: 'Zapier account' },
    { pattern: /\b(Airtable|airtable)\b/gi, replacement: 'Airtable account' },
    { pattern: /\b(Notion|notion)\b/gi, replacement: 'Notion account' },
    { pattern: /\b(Trello|trello)\b/gi, replacement: 'Trello account' },
    { pattern: /\b(Asana|asana)\b/gi, replacement: 'Asana account' },
    { pattern: /\b(Discord|discord)\b/gi, replacement: 'Discord account' },
    { pattern: /\b(Twilio|twilio)\b/gi, replacement: 'Twilio account' },
    { pattern: /\b(SendGrid|sendgrid)\b/gi, replacement: 'SendGrid account' },
    { pattern: /\b(AWS|Amazon Web Services)\b/gi, replacement: 'AWS account' },
    { pattern: /\b(Azure|Microsoft Azure)\b/gi, replacement: 'Azure account' },
  ];
  
  // Only apply platform patterns if the platform name exists in the requirement
  platformPatterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(generalized)) {
      // Remove the pattern and just show it once
      generalized = generalized.replace(pattern, replacement);
      // Remove duplicate "account account" if it exists
      generalized = generalized.replace(/\baccount\s+account\b/gi, 'account');
    }
  });
  
  // Step 3: Final cleanup
  generalized = generalized
    .replace(/\s+/g, ' ')
    .replace(/,\s*,/g, ',')
    .replace(/^\s*,\s*/, '')
    .replace(/\s*,\s*$/, '')
    .trim();
  
  // If the requirement is now empty or just whitespace, return a generic message
  if (!generalized || generalized.length < 3) {
    return 'Account access required';
  }
  
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
