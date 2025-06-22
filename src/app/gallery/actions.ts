"use server";

import { createClient } from "@/lib/supabase/server";
import { galleryFiltersSchema, type GalleryFilters } from "./gallery.types";

/**
 * Busca criativos E solicitações para a galeria com filtros avançados.
 * Retorna uma lista unificada e ordenada de ambos os tipos de dados.
 */
export async function getCreativesForGallery(filters: GalleryFilters) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado para buscar a galeria.");
  }

  const parsedFilters = galleryFiltersSchema.parse(filters);
  const { search, status, format, style, page, limit } = parsedFilters;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 1. Buscar Creative Requests
  let requestsQuery = supabase
    .from("creative_requests")
    .select(`
      id,
      title,
      prompt,
      status,
      style,
      created_at,
      primary_color,
      secondary_color,
      creatives ( id, format, result_url, status )
    `, { count: 'exact' })
    .eq("user_id", user.id);

  // 2. Buscar Creatives Individuais (que não pertencem a um request)
  let creativesQuery = supabase
    .from("creatives")
    .select(`
      id,
      title,
      prompt,
      status,
      style,
      format,
      result_url,
      created_at,
      error_message,
      primary_color,
      secondary_color,
      logo_url,
      product_images
    `, { count: 'exact' })
    .eq("user_id", user.id)
    .is('request_id', null);

  // Aplicar filtros a ambas as queries
  if (search && search.trim() !== '') {
    const searchQuery = `title.ilike.%${search}%,prompt.ilike.%${search}%`;
    requestsQuery = requestsQuery.or(searchQuery);
    creativesQuery = creativesQuery.or(searchQuery);
  }
  if (status && status.length > 0) {
    requestsQuery = requestsQuery.in('status', status);
    creativesQuery = creativesQuery.in('status', status);
  }
  if (format && format.length > 0) {
    // Para requests, filtramos se algum dos criativos filhos tem o formato
    requestsQuery = requestsQuery.filter('creatives.format', 'in', `(${format.join(',')})`);
    creativesQuery = creativesQuery.in('format', format);
  }
  if (style && style.length > 0) {
    requestsQuery = requestsQuery.in('style', style);
    creativesQuery = creativesQuery.in('style', style);
  }

  // Executar ambas as queries
  const [
    { data: requestsData, error: requestsError, count: requestsCount },
    { data: creativesData, error: creativesError, count: creativesCount }
  ] = await Promise.all([
    requestsQuery.order("created_at", { ascending: false }).range(from, to),
    creativesQuery.order("created_at", { ascending: false }).range(from, to)
  ]);

  if (requestsError || creativesError) {
    console.error("Gallery Fetch Error:", { requestsError, creativesError });
    throw new Error("Não foi possível carregar os itens da galeria.");
  }

  // Unificar e ordenar os resultados
  const unifiedData = [
    ...(requestsData || []).map(item => ({ ...item, type: 'request' })),
    ...(creativesData || []).map(item => ({ ...item, type: 'creative' }))
  ].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  // A contagem total é a soma de ambas as queries
  const totalCount = (requestsCount || 0) + (creativesCount || 0);

  return {
    data: unifiedData,
    count: totalCount,
  };
} 