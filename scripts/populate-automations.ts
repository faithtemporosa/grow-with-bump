import { automations } from "../src/data/automations";
import type { N8NWorkflow } from "../src/data/n8n-workflows";

// Generate SQL INSERT statements for all automations
function generateInsertStatements() {
  const statements: string[] = [];
  
  automations.forEach((automation) => {
    // Calculate price if not available (for base automations)
    let price = 0;
    
    // Check if it's an n8n workflow (they have workflowUrl)
    if (automation.workflowUrl) {
      // Price based on ROI level for n8n workflows
      if (automation.roiLevel === 'high') {
        price = 699 + Math.floor(Math.random() * 300); // 699-999
      } else if (automation.roiLevel === 'medium') {
        price = 399 + Math.floor(Math.random() * 200); // 399-599
      } else {
        price = 199 + Math.floor(Math.random() * 100); // 199-299
      }
    } else {
      // Price based on monthly savings for base automations
      price = Math.round((automation.monthlySavings || 0) / 3);
    }
    
    const escapedName = automation.name.replace(/'/g, "''");
    const escapedDescription = automation.description.replace(/'/g, "''");
    const escapedCategory = automation.category.replace(/'/g, "''");
    const escapedFeatures = automation.features.map(f => f.replace(/'/g, "''"));
    
    const statement = `INSERT INTO automations (id, name, description, category, price, features)
VALUES ('${automation.id}', '${escapedName}', '${escapedDescription}', '${escapedCategory}', ${price}, ARRAY[${escapedFeatures.map(f => `'${f}'`).join(', ')}])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  last_updated = now();`;
    
    statements.push(statement);
  });
  
  return statements.join('\n\n');
}

console.log(generateInsertStatements());
console.log(`\n\n-- Total automations: ${automations.length}`);
