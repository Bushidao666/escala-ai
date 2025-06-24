"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 🎯 SCHEMA PARA DADOS DO PERFIL
const profileUpdateSchema = z.object({
  name: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .optional(),
  bio: z.string()
    .max(200, "Bio deve ter no máximo 200 caracteres")
    .optional(),
  avatar_url: z.string().url().optional(),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// 🔧 INTERFACE PARA DADOS DO USUÁRIO
interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 📖 Busca dados completos do perfil do usuário
 */
export async function getUserProfile(): Promise<{ 
  success: boolean; 
  profile?: UserProfile; 
  error?: string 
}> {
  console.log("\n--- [PROFILE ACTION START: getUserProfile] ---");
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("getUserProfile: User not authenticated:", authError);
      return { success: false, error: "Usuário não autenticado" };
    }

    console.log(`Getting profile for user: ${user.id}`);

    // Busca dados na tabela users
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      // Se usuário não existe na tabela users, criar entrada
      if (profileError.code === 'PGRST116') {
        console.log("User not found in users table, creating entry...");
        
        const { data: newProfile, error: createError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0] || null,
            avatar_url: null,
            role: 'user'
          })
          .select()
          .single();

        if (createError) {
          console.error("getUserProfile: Failed to create user profile:", createError);
          return { success: false, error: "Não foi possível criar perfil do usuário" };
        }

        console.log("User profile created successfully");
        return { success: true, profile: newProfile };
      }

      console.error("getUserProfile: Database error:", profileError);
      return { success: false, error: "Erro ao buscar perfil do usuário" };
    }

    console.log("Profile retrieved successfully");
    console.log("--- [PROFILE ACTION END: getUserProfile] ---\n");
    
    return { success: true, profile };

  } catch (error: any) {
    console.error("getUserProfile: Unexpected error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

/**
 * ✏️ Atualiza dados do perfil do usuário
 */
export async function updateUserProfile(data: ProfileUpdateData): Promise<{
  success: boolean;
  profile?: UserProfile;
  error?: string;
}> {
  console.log("\n--- [PROFILE ACTION START: updateUserProfile] ---");
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("updateUserProfile: User not authenticated:", authError);
      return { success: false, error: "Usuário não autenticado" };
    }

    // Valida dados de entrada
    const validationResult = profileUpdateSchema.safeParse(data);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      console.error("updateUserProfile: Validation failed:", errorMessages);
      return { success: false, error: `Dados inválidos: ${errorMessages}` };
    }

    console.log(`Updating profile for user: ${user.id}`);
    console.log("Update data:", JSON.stringify(validationResult.data, null, 2));

    // Atualiza dados na tabela users
    const updateData = {
      ...validationResult.data,
      updated_at: new Date().toISOString()
    };

    const { data: updatedProfile, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("updateUserProfile: Database update failed:", updateError);
      return { success: false, error: "Não foi possível atualizar perfil" };
    }

    console.log("Profile updated successfully");
    console.log("--- [PROFILE ACTION END: updateUserProfile] ---\n");
    
    // Revalida páginas que usam dados do perfil
    revalidatePath("/profile");
    revalidatePath("/");
    
    return { success: true, profile: updatedProfile };

  } catch (error: any) {
    console.error("updateUserProfile: Unexpected error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

/**
 * 📷 Upload de avatar para o bucket profile-avatars
 */
export async function uploadProfileAvatar(formData: FormData): Promise<{
  success: boolean;
  avatarUrl?: string;
  error?: string;
}> {
  console.log("\n--- [PROFILE ACTION START: uploadProfileAvatar] ---");
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("uploadProfileAvatar: User not authenticated:", authError);
      return { success: false, error: "Usuário não autenticado" };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: "Nenhum arquivo encontrado" };
    }

    // Validações do arquivo
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      return { success: false, error: "Arquivo muito grande. Máximo 5MB" };
    }

    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Tipo de arquivo não suportado. Use JPEG, PNG ou WebP" };
    }

    console.log(`Uploading avatar for user: ${user.id}`);
    console.log(`File: ${file.name}, Size: ${file.size}, Type: ${file.type}`);

    // Remove avatar anterior se existir
    const oldAvatarPath = `${user.id}/avatar`;
    await supabase.storage
      .from('profile-avatars')
      .remove([`${oldAvatarPath}.jpg`, `${oldAvatarPath}.png`, `${oldAvatarPath}.webp`]);

    // Determina extensão do arquivo
    const fileExtension = file.type === 'image/jpeg' ? 'jpg' : 
                         file.type === 'image/png' ? 'png' : 'webp';
    
    const filePath = `${user.id}/avatar.${fileExtension}`;

    // Upload do novo avatar
    const { error: uploadError } = await supabase.storage
      .from('profile-avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error("uploadProfileAvatar: Storage upload failed:", uploadError);
      return { success: false, error: "Falha no upload do arquivo" };
    }

    // Obtém URL pública do avatar
    const { data } = supabase.storage
      .from('profile-avatars')
      .getPublicUrl(filePath);

    const avatarUrl = data.publicUrl;

    // Atualiza URL do avatar na tabela users
    const { error: updateError } = await supabase
      .from("users")
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("uploadProfileAvatar: Failed to update avatar_url:", updateError);
      // Remove arquivo que foi enviado
      await supabase.storage.from('profile-avatars').remove([filePath]);
      return { success: false, error: "Não foi possível atualizar URL do avatar" };
    }

    console.log(`Avatar uploaded successfully: ${avatarUrl}`);
    console.log("--- [PROFILE ACTION END: uploadProfileAvatar] ---\n");
    
    // Revalida páginas que mostram o avatar
    revalidatePath("/profile");
    revalidatePath("/");
    
    return { success: true, avatarUrl };

  } catch (error: any) {
    console.error("uploadProfileAvatar: Unexpected error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

/**
 * 🗑️ Remove avatar do perfil
 */
export async function removeProfileAvatar(): Promise<{
  success: boolean;
  error?: string;
}> {
  console.log("\n--- [PROFILE ACTION START: removeProfileAvatar] ---");
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("removeProfileAvatar: User not authenticated:", authError);
      return { success: false, error: "Usuário não autenticado" };
    }

    console.log(`Removing avatar for user: ${user.id}`);

    // Remove arquivos do storage
    const avatarPaths = [
      `${user.id}/avatar.jpg`,
      `${user.id}/avatar.png`, 
      `${user.id}/avatar.webp`
    ];

    await supabase.storage
      .from('profile-avatars')
      .remove(avatarPaths);

    // Remove URL do avatar na tabela users
    const { error: updateError } = await supabase
      .from("users")
      .update({
        avatar_url: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("removeProfileAvatar: Failed to update avatar_url:", updateError);
      return { success: false, error: "Não foi possível remover URL do avatar" };
    }

    console.log("Avatar removed successfully");
    console.log("--- [PROFILE ACTION END: removeProfileAvatar] ---\n");
    
    // Revalida páginas que mostram o avatar
    revalidatePath("/profile");
    revalidatePath("/");
    
    return { success: true };

  } catch (error: any) {
    console.error("removeProfileAvatar: Unexpected error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

/**
 * 📊 Busca estatísticas do usuário para o dashboard
 */
export async function getUserStats(): Promise<{
  success: boolean;
  stats?: {
    total_creatives: number;
    total_favorites: number;
    achievements_count: number;
    total_processing_time: number;
    last_login: string;
  };
  error?: string;
}> {
  console.log("\n--- [PROFILE ACTION START: getUserStats] ---");
  
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("getUserStats: User not authenticated:", authError);
      return { success: false, error: "Usuário não autenticado" };
    }

    console.log(`Getting stats for user: ${user.id}`);

    // Busca estatísticas na tabela user_stats
    const { data: stats, error: statsError } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (statsError) {
      // Se não existe entrada de stats, criar uma
      if (statsError.code === 'PGRST116') {
        console.log("No stats found, creating default entry...");
        
        const { data: newStats, error: createError } = await supabase
          .from("user_stats")
          .insert({
            user_id: user.id,
            total_creatives: 0,
            total_favorites: 0,
            achievements_count: 0,
            total_processing_time: 0,
            last_login: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error("getUserStats: Failed to create stats:", createError);
          return { success: false, error: "Não foi possível criar estatísticas" };
        }

        return { success: true, stats: newStats };
      }

      console.error("getUserStats: Database error:", statsError);
      return { success: false, error: "Erro ao buscar estatísticas" };
    }

    console.log("Stats retrieved successfully");
    console.log("--- [PROFILE ACTION END: getUserStats] ---\n");
    
    return { success: true, stats };

  } catch (error: any) {
    console.error("getUserStats: Unexpected error:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}

/**
 * 🔧 Action para debug de autenticação e perfil
 */
export async function debugUserProfile() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  console.log("Debug User Profile:");
  console.log("User:", user);
  console.log("Error:", error);
  
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    
    console.log("Profile:", profile);
  }
  
  return {
    user,
    error,
    message: user ? "Usuário autenticado" : "Usuário não autenticado"
  };
}