import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.4";

// Função para atualizar o status agregado de um Creative Request
async function updateCreativeRequestStatus(supabaseAdmin, requestId) {
  try {
    const { data: creatives, error } = await supabaseAdmin
      .from("creatives")
      .select("status")
      .eq("request_id", requestId);

    if (error || !creatives || creatives.length === 0) {
      console.log(`No creatives found for request ${requestId}, skipping status update.`);
      return;
    }

    const total = creatives.length;
    const completed = creatives.filter(c => c.status === 'completed').length;
    const failed = creatives.filter(c => c.status === 'failed').length;

    let newStatus = 'processing';
    if (failed === total) {
      newStatus = 'failed';
    } else if (completed + failed === total) {
      newStatus = completed > 0 ? 'completed' : 'failed';
      if (failed > 0 && completed > 0) {
        newStatus = 'partial';
      }
    }

    if (newStatus !== 'processing') {
       const { error: updateError } = await supabaseAdmin
        .from('creative_requests')
        .update({ status: newStatus })
        .eq('id', requestId);
        
      if (updateError) {
        throw new Error(`Failed to update creative request status for ${requestId}: ${updateError.message}`);
      }
      console.log(`Creative request ${requestId} status updated to: ${newStatus}`);
    }

  } catch (err) {
    console.error(`Error in updateCreativeRequestStatus for request ${requestId}:`, err.message);
  }
}


serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Encontrar o job mais antigo e pendente
    const { data: job, error: jobError } = await supabaseAdmin
      .from("queue_jobs")
      .select(`
        *,
        creatives (*)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (jobError || !job) {
      return new Response(JSON.stringify({ message: "No pending jobs found" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    let requestId = job.creatives.request_id;

    try {
      // 2. Marcar job como 'processing'
      await supabaseAdmin
        .from("queue_jobs")
        .update({ status: "processing", attempts: (job.attempts || 0) + 1, processing_started_at: new Date().toISOString() })
        .eq("id", job.id);
      
      await supabaseAdmin
        .from("creatives")
        .update({ status: "processing" })
        .eq("id", job.creative_id);


      // Lógica de Geração (simulada)
      console.log(`Processing creative: ${job.creatives.title}`);
      // ... aqui entraria a chamada para a API da OpenAI ...
      // ... simulando um sucesso após 10 segundos ...
      await new Promise(resolve => setTimeout(resolve, 10000));

      const generatedImageUrl = "https://exemplo.com/imagem_gerada.png"; // URL de exemplo
      
      // 4. Se sucesso, atualizar Creative e Job
      await supabaseAdmin
        .from("creatives")
        .update({
          status: "completed",
          result_url: generatedImageUrl,
          processed_at: new Date().toISOString(),
        })
        .eq("id", job.creative_id);

      await supabaseAdmin
        .from("queue_jobs")
        .update({ 
          status: "completed",
          processing_completed_at: new Date().toISOString() 
        })
        .eq("id", job.id);
        
      console.log(`Job ${job.id} completed successfully.`);

    } catch (err) {
      // 5. Se erro, marcar como 'failed'
      await supabaseAdmin
        .from("creatives")
        .update({ status: "failed", error_message: err.message })
        .eq("id", job.creative_id);
      
      await supabaseAdmin
        .from("queue_jobs")
        .update({ status: "failed", error_message: err.message, processing_completed_at: new Date().toISOString() })
        .eq("id", job.id);
        
      console.error(`Job ${job.id} failed:`, err.message);

    } finally {
      // 6. 🎯 O ELO PERDIDO: Atualizar o status do request-pai
      if (requestId) {
        console.log(`Creative belongs to request ${requestId}. Triggering status update.`);
        await updateCreativeRequestStatus(supabaseAdmin, requestId);
      }
    }

    return new Response(JSON.stringify({ message: `Job ${job.id} processed.` }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("General error in Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}); 