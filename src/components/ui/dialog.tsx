import React from 'react';

interface DialogProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ children, onOpenChange }) => {
  return <div>{children}</div>;
};

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const DialogContent: React.FC<DialogContentProps> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ className, children }) => {
  return <h2 className={className}>{children}</h2>;
};

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ className, children }) => {
  return <p className={className}>{children}</p>;
}; 