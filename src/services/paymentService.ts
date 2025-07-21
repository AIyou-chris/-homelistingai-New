import { SubscriptionStatus } from '../types';
import { supabase } from '../lib/supabase';

export const checkSubscription = async (userId: string): Promise<SubscriptionStatus> => {
  try {
    const response = await fetch('/functions/v1/verify-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify subscription');
    }

    const data = await response.json();
    
    // Map PayPal status to our SubscriptionStatus enum
    switch (data.status) {
      case 'ACTIVE':
        return SubscriptionStatus.ACTIVE;
      case 'CANCELLED':
        return SubscriptionStatus.CANCELED;
      case 'SUSPENDED':
        return SubscriptionStatus.PAST_DUE;
      case 'EXPIRED':
        return SubscriptionStatus.INACTIVE;
      default:
        return SubscriptionStatus.INACTIVE;
    }
  } catch (error) {
    console.error('Subscription check error:', error);
    return SubscriptionStatus.INACTIVE;
  }
};

export const cancelSubscription = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch('/functions/v1/manage-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user_id: userId, 
        action: 'cancel' 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return false;
  }
};

export const pauseSubscription = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch('/functions/v1/manage-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user_id: userId, 
        action: 'pause' 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to pause subscription');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Pause subscription error:', error);
    return false;
  }
};

export const reactivateSubscription = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch('/functions/v1/manage-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user_id: userId, 
        action: 'reactivate' 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to reactivate subscription');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    return false;
  }
};

export const getSubscriptionManagementURL = (): string => {
  // This would typically come from your backend or payment provider SDK
  return "https://www.paypal.com/myaccount/autopay/"; // Example URL
};
