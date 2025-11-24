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
      // Calculate price based on ROI level and monthly savings
      let price = 0;
      if (automation.workflowUrl) {
        // n8n workflows - use ROI level
        if (automation.roiLevel === 'high') {
          price = 699 + Math.floor(Math.random() * 300); // 699-999
        } else if (automation.roiLevel === 'medium') {
          price = 399 + Math.floor(Math.random() * 200); // 399-599
        } else {
          price = 199 + Math.floor(Math.random() * 100); // 199-299
        }
      } else {
        // Base automations - use monthly savings
        price = Math.round((automation.monthlySavings || 500) / 3);
      }
      
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
