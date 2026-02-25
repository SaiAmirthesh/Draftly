import { supabase } from "./supabaseClient";

export const draftService = {
  // Get all drafts for the current user
  async getDrafts() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .order('generated_at', { ascending: false });

    if (error) {
      console.error('Error fetching drafts:', error);
      throw error;
    }
    return data;
  },

  // Get a single draft by ID
  async getDraftById(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching draft:', error);
      throw error;
    }
    return data;
  },

  // Save a new draft
  async saveDraft(draftData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('drafts')
      .insert({
        user_id: user.id,
        ...draftData,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
    return data;
  },

  // Update an existing draft
  async updateDraft(id, updates) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('drafts')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating draft:', error);
      throw error;
    }
    return data;
  },

  // Delete a draft
  async deleteDraft(draftId) {
    const { error } = await supabase
      .from('drafts')
      .delete()
      .eq('id', draftId);

    if (error) {
      console.error('Error deleting draft:', error);
      throw error;
    }
    return true;
  }
};
