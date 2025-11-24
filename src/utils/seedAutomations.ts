import { parseAutomationsCatalog } from "@/utils/parseAutomationsCatalog";

/**
 * Seeds the automations table with all parsed automations from CSV
 * Uses edge function with service role permissions to bypass RLS
 */
export async function seedAutomationsDatabase() {
  const automations = await parseAutomationsCatalog();
  
  console.log(`Starting to seed ${automations.length} automations...`);
  
  // Map automations to database format
  const dbAutomations = automations.map(automation => {
    // All automations are $500
    const price = 500;
    
    return {
      id: automation.id,
      name: automation.name,
      description: automation.description,
      category: automation.category,
      price: price,
      features: automation.features
    };
  });
  
  // Call edge function with service role permissions
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-automations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ automations: dbAutomations })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to seed automations');
  }
  
  const result = await response.json();
  
  console.log(`\n✅ Seeding complete!`);
  console.log(`   Success: ${result.successCount} automations`);
  console.log(`   Errors: ${result.errorCount} automations`);
  
  return { successCount: result.successCount, errorCount: result.errorCount };
}

// Export a function to run from console
export async function runSeed() {
  try {
    const result = await seedAutomationsDatabase();
    return result;
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}
