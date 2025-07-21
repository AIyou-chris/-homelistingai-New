import React from 'react';
import * as authService from '../../services/authService';

interface SocialLoginButtonsProps {
  onError?: (error: string) => void;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  variant?: 'dark' | 'light';
}

const SocialLoginButtons = () => <></>;

export default SocialLoginButtons; 