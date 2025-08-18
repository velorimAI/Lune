'use client'

import { Button as ShadcnButton, buttonVariants } from '@/components/ui/button'
import { VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/app/utils/cn'

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  href?: string
}

export const Button = ({
  children,
  type = 'button',
  isLoading,
  href,
  disabled,
  className,
  variant,
  size,
  ...props
}: ButtonProps) => {
  const content = isLoading ? (
    <>
      <LoaderCircle className="animate-spin" /> {children}
    </>
  ) : (
    children
  )

  const commonProps = {
    className: cn(
      buttonVariants({ variant, size }),
      'flex items-center gap-1',
      isLoading || disabled ? 'pointer-events-none opacity-75' : '',
      className
    ),
    disabled: isLoading || disabled,
    ...props,
  }

  if (href) {
    return (
      <Link href={href} className={commonProps.className}>
        {content}
      </Link>
    )
  }

  return (
    <ShadcnButton type={type} {...commonProps}>
      {content}
    </ShadcnButton>
  )
}

Button.displayName = 'Button'
