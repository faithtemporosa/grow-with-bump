import { supabase } from "@/integrations/supabase/client";
import { automations } from "@/data/automations";

/**
 * Seeds the automations table with all parsed n8n workflows and base automations
 * This function should be called once to populate the database
 */
export async function seedAutomationsDatabase() {
  console.log(`Starting to seed ${automations.length} automations...`);
  
  // Process in batches of 100 to avoid overwhelming the database
  const batchSize = 100;
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < automations.length; i += batchSize) {
    const batch = automations.slice(i, i + batchSize);
    
    // Map automations to database format
    const dbAutomations = batch.map(automation => {
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
    
    // Insert batch
    const { data, error } = await supabase
      .from('automations')
      .upsert(dbAutomations, {
        onConflict: 'id'
      });
    
    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      console.log(`✓ Inserted batch ${i / batchSize + 1} (${successCount} total)`);
    }
  }
  
  console.log(`\n✅ Seeding complete!`);
  console.log(`   Success: ${successCount} automations`);
  console.log(`   Errors: ${errorCount} automations`);
  
  return { successCount, errorCount };
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
