import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-black/40 backdrop-blur-md border border-white/10 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-white text-black hover:bg-gray-200 border border-white/20",
              formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white",
              footerActionLink: "text-blue-400 hover:text-blue-300",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-white/5 border-white/20 text-white",
            },
          }}
        />
      </div>
    </div>
  )
}

