import { Progress } from "@/components/ui/progress"
import { formatCents, progressPercent } from "@/lib/utils"

interface ProgressBarProps {
  collected: number // cents
  target: number // cents
}

export function ProgressBar({ collected, target }: ProgressBarProps) {
  const percent = progressPercent(collected, target)

  return (
    <div className="space-y-1.5">
      <Progress value={percent} className="h-2.5" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {formatCents(collected)} / {formatCents(target)}
        </span>
        <span>{percent}%</span>
      </div>
    </div>
  )
}
