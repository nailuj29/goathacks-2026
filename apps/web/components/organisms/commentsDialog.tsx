'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Comment from './comment';

interface CommentData {
	username: string;
	avatarUrl: string;
	avatarFallback: string;
	text: string;
	timestamp: string;
}

interface CommentsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	comments?: CommentData[];
}

const SAMPLE_COMMENTS: CommentData[] = [
	{
		username: 'Sarah Chen',
		avatarUrl: 'https://github.com/shadcn.png',
		avatarFallback: 'SC',
		text: 'Amazing view! 🔥',
		timestamp: '2h ago',
	},
	{
		username: 'Alex Rivera',
		avatarUrl: 'https://github.com/shadcn.png',
		avatarFallback: 'AR',
		text: 'Where was this taken?',
		timestamp: '1h ago',
	},
	{
		username: 'Jordan Lee',
		avatarUrl: 'https://github.com/shadcn.png',
		avatarFallback: 'JL',
		text: 'Absolutely stunning! Adding this to my bucket list 📍',
		timestamp: '30m ago',
	},
];

export default function CommentsDialog({
	open,
	onOpenChange,
	comments = SAMPLE_COMMENTS,
}: CommentsDialogProps) {
	const [newComment, setNewComment] = useState('');

	const handleAddComment = (e: React.FormEvent) => {
		e.preventDefault();
		if (newComment.trim()) {
			setNewComment('');
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm w-[calc(100vw-2rem)] p-4">
				<DialogHeader>
					<DialogTitle>Comments</DialogTitle>
				</DialogHeader>

				<div className="max-h-96 overflow-y-auto space-y-1 py-4 border-t border-b">
					{comments.map((comment, index) => (
						<Comment key={index} {...comment} />
					))}
				</div>

				<form onSubmit={handleAddComment} className="flex gap-2 pt-4">
					<Input
						placeholder="Add a comment..."
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						className="flex-1"
					/>
					<Button type="submit" size="sm" disabled={!newComment.trim()}>
						Post
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
