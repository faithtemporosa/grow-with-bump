import { supabase } from "@/integrations/supabase/client";
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
  
  // Call edge function with service role permissions using Supabase client
  const { data, error } = await supabase.functions.invoke('seed-automations', {
    body: { automations: dbAutomations }
  });
  
  if (error) {
    console.error('Error calling edge function:', error);
    throw new Error(error.message || 'Failed to seed automations');
  }
  
  if (!data.success) {
    throw new Error('Seeding failed');
  }
  
  console.log(`\n✅ Seeding complete!`);
  console.log(`   Success: ${data.successCount} automations`);
  console.log(`   Errors: ${data.errorCount} automations`);
  
  return { successCount: data.successCount, errorCount: data.errorCount };
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
