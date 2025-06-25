import { supabase } from '../lib/supabase';
import { 
  UserProfile, 
  UserPreferences, 
  UserFavorite, 
  UserSearchAlert, 
  UserActivityLog, 
  UserChatHistory,
  OnboardingData,
  AIRecommendation,
  AIRecommendationRequest
} from '../types';

export class UserService {
  // User Profile Methods
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data;
  }

  // User Preferences Methods
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }

    return data;
  }

  static async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }

    return data;
  }

  // Favorites Methods
  static async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        listing:listings(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user favorites:', error);
      return [];
    }

    return data || [];
  }

  static async addToFavorites(userId: string, listingId: string, notes?: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        listing_id: listingId,
        notes
      });

    if (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }

    // Log activity
    await this.logActivity(userId, 'save_listing', { listing_id: listingId });
    return true;
  }

  static async removeFromFavorites(userId: string, listingId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);

    if (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }

    return true;
  }

  static async isFavorite(userId: string, listingId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .single();

    if (error) {
      return false;
    }

    return !!data;
  }

  static async updateFavoriteNote(favoriteId: string, notes: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_favorites')
      .update({ notes })
      .eq('id', favoriteId);

    return { error };
  }

  // Search Alerts Methods
  static async getUserSearchAlerts(userId: string): Promise<UserSearchAlert[]> {
    const { data, error } = await supabase
      .from('user_search_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching search alerts:', error);
      return [];
    }

    return data || [];
  }

  static async createSearchAlert(userId: string, name: string, searchCriteria: any): Promise<UserSearchAlert | null> {
    const { data, error } = await supabase
      .from('user_search_alerts')
      .insert({
        user_id: userId,
        name,
        search_criteria: searchCriteria
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating search alert:', error);
      return null;
    }

    return data;
  }

  static async updateSearchAlert(alertId: string, updates: Partial<UserSearchAlert>): Promise<boolean> {
    const { error } = await supabase
      .from('user_search_alerts')
      .update(updates)
      .eq('id', alertId);

    if (error) {
      console.error('Error updating search alert:', error);
      return false;
    }

    return true;
  }

  static async deleteSearchAlert(alertId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_search_alerts')
      .delete()
      .eq('id', alertId);

    if (error) {
      console.error('Error deleting search alert:', error);
      return false;
    }

    return true;
  }

  // Activity Logging
  static async logActivity(
    userId: string, 
    activityType: UserActivityLog['activity_type'], 
    activityData: UserActivityLog['activity_data'] = {}
  ): Promise<boolean> {
    const { error } = await supabase
      .from('user_activity_log')
      .insert({
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      });

    if (error) {
      console.error('Error logging activity:', error);
      return false;
    }

    return true;
  }

  // Chat History Methods
  static async saveChatMessage(
    userId: string,
    sessionId: string,
    messageType: 'user' | 'ai' | 'system',
    messageContent: string,
    metadata: any = {}
  ): Promise<boolean> {
    const { error } = await supabase
      .from('user_chat_history')
      .insert({
        user_id: userId,
        session_id: sessionId,
        message_type: messageType,
        message_content: messageContent,
        message_metadata: metadata
      });

    if (error) {
      console.error('Error saving chat message:', error);
      return false;
    }

    return true;
  }

  static async getChatHistory(userId: string, sessionId?: string): Promise<UserChatHistory[]> {
    let query = supabase
      .from('user_chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }

    return data || [];
  }

  // Onboarding Methods
  static async completeOnboarding(userId: string, onboardingData: OnboardingData): Promise<boolean> {
    // Update user profile with onboarding data
    const profileUpdates: Partial<UserProfile> = {
      onboarding_completed: true,
      onboarding_step: 100,
      is_first_time_buyer: onboardingData.user_type === 'buyer',
      is_investor: onboardingData.user_type === 'investor',
      has_agent: onboardingData.has_agent
    };

    // Update preferences with onboarding data
    const preferenceUpdates: Partial<UserPreferences> = {
      preferred_property_types: onboardingData.property_types,
      min_price: onboardingData.budget_range.min,
      max_price: onboardingData.budget_range.max,
      preferred_cities: onboardingData.preferred_locations,
      email_notifications: onboardingData.contact_preferences.email,
      sms_notifications: onboardingData.contact_preferences.sms
    };

    const [profileResult, preferenceResult] = await Promise.all([
      this.updateUserProfile(userId, profileUpdates),
      this.updateUserPreferences(userId, preferenceUpdates)
    ]);

    return !!(profileResult && preferenceResult);
  }

  static async updateOnboardingStep(userId: string, step: number): Promise<boolean> {
    const { error } = await supabase
      .from('user_profiles')
      .update({ onboarding_step: step })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating onboarding step:', error);
      return false;
    }

    return true;
  }

  // AI Recommendations
  static async getAIRecommendations(request: AIRecommendationRequest): Promise<AIRecommendation[]> {
    // Get user preferences
    const preferences = await this.getUserPreferences(request.user_id);
    if (!preferences) {
      return [];
    }

    // Build query based on preferences
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'active');

    // Apply filters based on preferences
    if (preferences.min_price && preferences.max_price) {
      query = query.gte('price', preferences.min_price).lte('price', preferences.max_price);
    }

    if (preferences.min_bedrooms) {
      query = query.gte('bedrooms', preferences.min_bedrooms);
    }

    if (preferences.max_bedrooms) {
      query = query.lte('bedrooms', preferences.max_bedrooms);
    }

    if (preferences.preferred_cities.length > 0) {
      query = query.in('city', preferences.preferred_cities);
    }

    // Limit results
    const limit = request.limit || 10;
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching AI recommendations:', error);
      return [];
    }

    // Transform to AIRecommendation format
    return (data || []).map((listing, index) => ({
      listing_id: listing.id,
      score: 100 - (index * 5), // Simple scoring based on position
      reasons: [
        `Matches your ${preferences.min_bedrooms}+ bedroom preference`,
        `Within your $${preferences.min_price.toLocaleString()} - $${preferences.max_price.toLocaleString()} budget`,
        'Recently listed'
      ],
      match_percentage: Math.max(85 - (index * 3), 60),
      listing
    }));
  }

  // Utility Methods
  private static async getClientIP(): Promise<string | undefined> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting client IP:', error);
      return undefined;
    }
  }

  // Analytics Methods
  static async getUserAnalytics(userId: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('user_activity_log')
      .select('activity_type, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) {
      console.error('Error fetching user analytics:', error);
      return {};
    }

    // Process analytics data
    const activityCounts = data?.reduce((acc, activity) => {
      acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return {
      total_activities: data?.length || 0,
      activity_breakdown: activityCounts,
      most_active_day: this.getMostActiveDay(data || []),
      favorite_listings_count: await this.getUserFavorites(userId).then(favs => favs.length)
    };
  }

  private static getMostActiveDay(activities: Array<{ activity_type: string; created_at: string }>): string | null {
    if (activities.length === 0) return null;

    const dayCounts = activities.reduce((acc, activity) => {
      const day = new Date(activity.created_at).toDateString();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dayCounts).reduce((a, b) => 
      dayCounts[a[0]] > dayCounts[b[0]] ? a : b
    )[0];
  }
} 