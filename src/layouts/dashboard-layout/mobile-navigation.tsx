import { DashboardSidebar } from './dashboard-sidebar'
import { Sheet, SheetContent } from '@/shared/components/ui'

type MobileNavigationProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNavigation({
  open,
  onOpenChange,
}: MobileNavigationProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[min(19rem,90vw)] border-0 p-0">
        <DashboardSidebar
          collapsed={false}
          onCollapsedChange={() => undefined}
          onNavigate={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
