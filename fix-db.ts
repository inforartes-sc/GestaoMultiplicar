import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cyvcfqcpadsmwjtknxpv.supabase.co";
const supabaseAnonKey = "sb_publishable_Q2VHIuw3tBia5C_vOdZJdw_o1PGpf_8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Fetching user 'marcos.silva'...");
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('login', 'marcos.silva')
    .single();

  if (userError || !userData) {
    console.error("Error fetching user:", userError);
    return;
  }

  const { id: userId, candidato_id: candidatoId } = userData;
  console.log(`User found: ID=${userId}, candidatoId=${candidatoId}`);

  if (!candidatoId) {
    console.warn("User 'marcos.silva' does not have a candidatoId associated.");
    return;
  }

  console.log("Updating electors to match user's candidate ID...");
  const { data: updateData, error: updateError } = await supabase
    .from('eleitores')
    .update({ candidato_id: candidatoId })
    .eq('multiplicador_id', userId)
    .select();

  if (updateError) {
    console.error("Error updating electors:", updateError);
  } else {
    console.log(`Successfully updated ${updateData.length} electors to candidatoId ${candidatoId}:`, updateData);
  }
}

run();
