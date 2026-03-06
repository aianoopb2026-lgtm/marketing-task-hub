export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <div className="w-11 h-11 bg-[#09090b] rounded-xl flex items-center justify-center mb-5 mx-auto">
            <span className="text-white font-semibold text-lg tracking-tight">M</span>
          </div>
          <h1 className="text-[22px] font-semibold text-[#09090b] tracking-tight">Marketing Task Hub</h1>
          <p className="text-[14px] text-neutral-400 mt-1.5 tracking-normal">Keep the team in sync</p>
        </div>
        {children}
      </div>
    </div>
  )
}
