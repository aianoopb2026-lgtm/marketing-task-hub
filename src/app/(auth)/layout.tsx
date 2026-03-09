export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <div className="w-11 h-11 bg-[#FF6B35] rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-[0_4px_12px_rgba(255,107,53,0.3)]">
            <span className="text-white font-semibold text-lg tracking-tight">M</span>
          </div>
          <h1 className="text-[22px] font-semibold text-[#2D2A26] tracking-tight">Marketing Task Hub</h1>
          <p className="text-[14px] text-[#9C8E7C] mt-1.5 tracking-normal">Keep the team in sync</p>
        </div>
        {children}
      </div>
    </div>
  )
}
