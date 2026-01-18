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
import { decryptStegImage } from '@/lib/stegano';
import { useRouter } from 'next/dist/client/components/navigation';
import { APIPost } from '@/lib/backendtypes';

interface CommentsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onShowHidden: () => void;
	post: APIPost;
}

export default function CommentsDialog({
	open,
	onOpenChange,
	post,
}: CommentsDialogProps) {
	const [newComment, setNewComment] = useState('');
	const [hiddenFiles, setHiddenFiles] = useState<File[]>([]);

	const router = useRouter();
	const queryClient = useQueryClient();

	const commentMutation = useMutation({
		mutationFn: async (commentText: string) => {
			const response = await api.post(`/comments/${post._id}/add`, {
				text: commentText,
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['feed-posts'] });
		},
	});

	const handleAddComment = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!newComment.trim()) {
			return;
		}

		for (const imageUrl of post.images) {
			try {
				const response = await api.get(imageUrl, { responseType: 'blob' });
				const file = new File([response.data], 'image.jpeg', {
					type: 'image/jpeg',
				});

				decryptStegImage(file, newComment).then((hiddenMessage) => {
					if (hiddenMessage) {
						console.log('Extracted hidden message:', hiddenMessage);
						setHiddenFiles((prev) => [...prev, ...hiddenMessage]);
					} else {
						console.log('No hidden message found in image:', imageUrl);
					}
				});

				return;
			} catch (error) {
				console.error(
					`Failed to extract hidden message from ${imageUrl}:`,
					error,
				);
			}
		}

		commentMutation.mutate(newComment);
		setNewComment('');
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm w-[calc(100vw-2rem)] p-4">
				<DialogHeader>
					<DialogTitle>Comments</DialogTitle>
				</DialogHeader>

				<div className="max-h-96 overflow-y-auto space-y-1 py-4 border-t border-b">
					{post.comments.length > 0 ? (
						post.comments.map((comment, index) => (
							<Comment key={index} comment={comment} />
						))
					) : (
						<p className="text-gray-500">No comments yet.</p>
					)}
				</div>

				{hiddenFiles.length > 0 && (
					<div className="flex gap-2 flex-wrap">
						<p className="w-full font-semibold">Hidden Files:</p>
						{hiddenFiles.map((file, index) => (
							<Button
								key={index}
								size="sm"
								variant="outline"
								onClick={() => {
									const url = URL.createObjectURL(file);
									router.push(url);
								}}
							>
								{file.name}
							</Button>
						))}
					</div>
				)}

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
