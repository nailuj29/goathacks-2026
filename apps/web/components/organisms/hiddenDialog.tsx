import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface HiddenDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function HiddenDialog({
	open,
	onOpenChange,
}: HiddenDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm w-[calc(100vw-2rem)] p-4">
				<DialogHeader>
					<DialogTitle>Message</DialogTitle>
				</DialogHeader>

				<div className="py-4">
					<p>This is an encoded message asdjsgkjdafghkldjsf</p>
				</div>

				<Button className="mt-4 w-full" onClick={() => onOpenChange(false)}>
					Close
				</Button>
			</DialogContent>
		</Dialog>
	);
}
