export default function LoadingSpinner({ message = "불러오는 중..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-[#2a2a4a]" />
        <div className="absolute inset-0 rounded-full border-4 border-[#ff6b2b] border-t-transparent animate-spin" />
      </div>
      <p className="text-[#8888aa] text-sm">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#2a2a4a] bg-[#13132a] p-6 space-y-4">
      <div className="flex gap-4">
        <div className="w-28 h-28 rounded-xl skeleton" />
        <div className="flex-1 space-y-3">
          <div className="h-7 w-48 rounded skeleton" />
          <div className="h-4 w-32 rounded skeleton" />
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map(i => <div key={i} className="h-12 rounded skeleton" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorCard({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-14 h-14 rounded-full bg-[#ff4444]/10 border border-[#ff4444]/30
        flex items-center justify-center text-[#ff4444] text-2xl font-bold">
        !
      </div>
      <p className="text-white font-semibold">오류가 발생했습니다</p>
      <p className="text-[#8888aa] text-sm text-center max-w-sm">{message}</p>
    </div>
  );
}
