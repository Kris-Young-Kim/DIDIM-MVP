import React from "react";

interface FormWrapperProps {
  title: string;
  children: React.ReactNode;
}

export default function FormWrapper({ title, children }: FormWrapperProps) {
  return (
    <div className="mb-8 border-b border-white/10 pb-8 last:border-0 last:pb-0">
      <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-3">
        <span className="w-1.5 h-6 bg-primary rounded-full inline-block shadow-primary/40" />
        {title}
      </h3>
      <div className="space-y-6 pl-3 text-foreground">
        {children}
      </div>
    </div>
  );
}

