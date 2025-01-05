import { Loader2 } from 'lucide-react'

export default function ThinkingState() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      <span className="text-sm font-medium text-blue-600">ThrillTrail is thinking...</span>
    </div>
  )
}

