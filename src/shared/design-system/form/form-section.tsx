import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader } from '@/shared/components/ui'
import { SectionTitle, Typography } from '@/shared/design-system/typography'

type FormSectionProps = {
  title: string
  description?: string
  children: ReactNode
}

export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <SectionTitle>{title}</SectionTitle>
        {description ? (
          <Typography variant="muted" className="mt-1">
            {description}
          </Typography>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
