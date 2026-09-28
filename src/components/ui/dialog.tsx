import React from 'react';
import * as Primitive from '@radix-ui/react-dialog';
import { cn } from '@utils';

export const Dialog = Primitive.Root;
export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => <div className={cn('grid gap-2', className)} {...props} />;
export const DialogTitle = ({ className, ...props }: React.ComponentProps<typeof Primitive.Title>): React.JSX.Element => <Primitive.Title className={cn('text-xl font-semibold', className)} {...props} />;
export const DialogDescription = ({ className, ...props }: React.ComponentProps<typeof Primitive.Description>): React.JSX.Element => <Primitive.Description className={cn('text-sm text-slate-600', className)} {...props} />;
export const DialogContent = ({ className, children, ...props }: React.ComponentProps<typeof Primitive.Content>): React.JSX.Element => (
	<Primitive.Portal>
		<Primitive.Overlay className='fixed inset-0 z-[100] bg-black/60' />
		<Primitive.Content className={cn('fixed left-1/2 top-1/2 z-[101] max-h-[85vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg border bg-white p-6 shadow-xl', className)} {...props}>{children}</Primitive.Content>
	</Primitive.Portal>
);
