'use client';

import { FC, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card as CardShadcn,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/app/utils/cn';
import { cva } from 'class-variance-authority';
import ToolTip from './custom-tooltip';


type CardProps = {
  children?: ReactNode;
  className?: string | undefined;
  contentClassName?: string | undefined;
  description?: ReactNode;
  extra?: ReactNode;
  footer?: ReactNode;
  hasBackButton?: boolean;
  title?: ReactNode;
  headerStyle?: string | undefined;
  titleStyle?: string | undefined;
  titleToolTip?: {
    hint: string | ReactNode;
    className?: string;
    tooltipTriggerIcon?: any;
  };
  variant?: any;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const cardVariants = cva(
  'rounded-xl border bg-card text-card-foreground shadow',
  {
    variants: {
      variant: {
        default: '',
        outline: 'border border-border bg-transparent shadow-none',
        elevated: 'shadow-lg',
        ghost: 'border-none dark:bg-box-background dark:text-zinc-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const Card: FC<CardProps> = (props) => {
  const {
    children,
    className,
    contentClassName,
    description,
    extra,
    footer,
    hasBackButton,
    onClick,
    title,
    headerStyle,
    titleStyle,
    titleToolTip,
    variant,
  } = props;

  const router = useRouter();

  return (
    <CardShadcn
      className={cn(cardVariants({ variant }), className, 'dark:shadow-black')}
      onClick={onClick}
    >
      {(title || description || hasBackButton || extra) && (
        <CardHeader
          className={cn(
            'flex flex-row justify-between items-center px-8 py-6',
            headerStyle
          )}
        >
          <div className="flex-1">
            {title && (
              <CardTitle
                className={cn(
                  titleStyle,
                  'dark:text-zinc-400 gap-1 flex items-center'
                )}
              >
                {title}{' '}
                {titleToolTip && (
                  <ToolTip
                    className={titleToolTip?.className}
                    hint={titleToolTip?.hint}
                    tooltipTriggerIcon={titleToolTip?.tooltipTriggerIcon}
                  />
                )}
              </CardTitle>
            )}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex flex-row justify-center items-center">
            <div className="mr-2">{extra}</div>
            {hasBackButton && (
              <Button
                className="dark:bg-box-brighter dark:text-zinc-400"
                variant="outline"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft />
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={`${contentClassName}`}>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardShadcn>
  );
};
