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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface CommentsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onShowHidden: () => void;
	comments: APIComment[];
	postId: string;
}

export default function CommentsDialog({
	open,
	onOpenChange,
	postId,
	comments,
}: CommentsDialogProps) {
	const [newComment, setNewComment] = useState('');

	const queryClient = useQueryClient();

	const commentMutation = useMutation({
		mutationFn: async (commentText: string) => {
			const response = await api.post(`/comments/${postId}/add`, {
				text: commentText,
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['feed-posts'] });
		},
	});

	const handleAddComment = (e: React.FormEvent) => {
		e.preventDefault();
		commentMutation.mutate(newComment);

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
					{comments ? (
						comments.map((comment, index) => (
							<Comment key={index} comment={comment} />
						))
					) : (
						<p className="text-gray-500">No comments yet.</p>
					)}
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
