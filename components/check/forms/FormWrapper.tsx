import React from "react";

interface FormWrapperProps {
  title: string;
  children: React.ReactNode;
}

export default function FormWrapper({ title, children }: FormWrapperProps) {
  return (
    <div className="mb-8 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
        <span className="w-1 h-6 bg-[#6c47ff] rounded-full inline-block" />
        {title}
      </h3>
      <div className="space-y-6 pl-3">
        {children}
      </div>
    </div>
  );
}

