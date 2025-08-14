import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading CodeTest Platform..." />
    </div>
  )
}
