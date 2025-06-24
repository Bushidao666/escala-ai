import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.4";

// Função melhorada para atualizar o status agregado de um Creative Request
async function updateCreativeRequestStatus(supabaseAdmin, requestId) {
  try {
    console.log(`🔄 Starting status update for request: ${requestId}`);
    
    const { data: creatives, error } = await supabaseAdmin
      .from("creatives")
      .select("status")
      .eq("request_id", requestId);

    if (error) {
      console.error(`❌ Error fetching creatives for request ${requestId}:`, error);
      return;
    }

    if (!creatives || creatives.length === 0) {
      console.log(`⚠️ No creatives found for request ${requestId}, skipping status update.`);
      return;
    }

    console.log(`📊 Found ${creatives.length} creatives for request ${requestId}`);
    
    const total = creatives.length;
    const completed = creatives.filter(c => c.status === 'completed').length;
    const failed = creatives.filter(c => c.status === 'failed').length;
    const processing = creatives.filter(c => c.status === 'processing').length;
    const queued = creatives.filter(c => c.status === 'queued').length;

    console.log(`📈 Status breakdown: completed=${completed}, failed=${failed}, processing=${processing}, queued=${queued}, total=${total}`);

    let newStatus = 'processing';
    
    if (failed === total) {
      newStatus = 'failed'; // Todos falharam
      console.log(`🔴 All creatives failed -> setting request status to 'failed'`);
    } else if (completed === total) {
      newStatus = 'completed'; // Todos concluídos
      console.log(`🟢 All creatives completed -> setting request status to 'completed'`);
    } else if (completed > 0 && failed > 0 && (completed + failed) === total) {
      newStatus = 'partial'; // Alguns concluídos, alguns falharam, nenhum processando
      console.log(`🟡 Mix of completed and failed -> setting request status to 'partial'`);
    } else if (completed > 0 && (completed + failed) === total) {
      newStatus = 'completed'; // Todos processados (apenas completed)
      console.log(`🟢 All processed as completed -> setting request status to 'completed'`);
    } else if (processing > 0 || queued > 0) {
      newStatus = 'processing'; // Ainda há criativos sendo processados
      console.log(`🟠 Still processing -> keeping request status as 'processing'`);
    }

    console.log(`🎯 Determined new status: ${newStatus}`);

    const { error: updateError } = await supabaseAdmin
      .from('creative_requests')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
        
    if (updateError) {
      console.error(`❌ Failed to update creative request status for ${requestId}:`, updateError);
      throw new Error(`Failed to update creative request status for ${requestId}: ${updateError.message}`);
    }
    
    console.log(`✅ Creative request ${requestId} status updated from 'processing' to: ${newStatus}`);

  } catch (err) {
    console.error(`💥 Error in updateCreativeRequestStatus for request ${requestId}:`, err.message);
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
    console.log(`🚀 Processing job ${job.id} for creative ${job.creative_id}, request: ${requestId || 'standalone'}`);

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

      console.log(`📝 Job ${job.id} marked as processing`);

      // Lógica de Geração (simulada)
      console.log(`🎨 Processing creative: ${job.creatives.title}`);
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
        
      console.log(`✅ Job ${job.id} completed successfully.`);

    } catch (err) {
      // 5. Se erro, marcar como 'failed'
      console.error(`❌ Job ${job.id} failed:`, err.message);
      
      await supabaseAdmin
        .from("creatives")
        .update({ status: "failed", error_message: err.message })
        .eq("id", job.creative_id);
      
      await supabaseAdmin
        .from("queue_jobs")
        .update({ status: "failed", error_message: err.message, processing_completed_at: new Date().toISOString() })
        .eq("id", job.id);

    } finally {
      // 6. 🎯 SEMPRE atualizar o status do request-pai (se houver)
      if (requestId) {
        console.log(`🔄 Creative belongs to request ${requestId}. Triggering status update.`);
        await updateCreativeRequestStatus(supabaseAdmin, requestId);
      } else {
        console.log(`ℹ️ Creative is standalone (no request_id). Skipping request status update.`);
      }
    }

    return new Response(JSON.stringify({ 
      message: `Job ${job.id} processed.`,
      request_id: requestId,
      creative_id: job.creative_id
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("💥 General error in Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}); 