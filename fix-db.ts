import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cyvcfqcpadsmwjtknxpv.supabase.co";
const supabaseAnonKey = "sb_publishable_Q2VHIuw3tBia5C_vOdZJdw_o1PGpf_8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Fixing database settings name...");
  const { data, error } = await supabase
    .from('settings')
    .update({ nome_sistema: 'Multiplicador 360' })
    .eq('id', 1)
    .select();
  if (error) {
    console.error("Error updating settings:", error);
  } else {
    console.log("Successfully fixed settings in DB:", data);
  }
}

run();
