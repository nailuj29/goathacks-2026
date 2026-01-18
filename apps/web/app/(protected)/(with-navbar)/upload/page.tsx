'use client';

import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SModeContext } from '../layout';
import { createJunkImage, createStegImage } from '@/lib/stegano';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export default function UploadPage() {
	const [isLoading, setIsLoading] = useState(false);
	const sMode = useContext(SModeContext);
	const queryClient = useQueryClient();

	console.log(sMode);

	const uploadPost = useMutation({
		mutationFn: async (post: APIUploadPost) => {
			const response = api.post('/posts/publish', post);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['feed-posts'] });
		},
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		const images = formData.getAll('image') as File[];
		const caption = formData.get('caption') as string;
		const hiddenMessages = formData.getAll('h-message') as File[];
		const key = formData.get('h-key') as string | null;

		if (sMode && hiddenMessages.length > 0 && key) {
			const messagesPerImage = Math.floor(
				hiddenMessages.length / images.length,
			);
			let messageIndex = 0;

			for (let i = 0; i < images.length; i++) {
				let messagesToEmbed: File[] = [];

				if (i < images.length - 1) {
					// For all images except the last, assign equal portions
					messagesToEmbed = hiddenMessages.slice(
						messageIndex,
						messageIndex + messagesPerImage,
					);
					messageIndex += messagesPerImage;
				} else {
					// For the last image, assign all remaining messages
					messagesToEmbed = hiddenMessages.slice(messageIndex);
				}

				images[i] = await createStegImage(images[i], messagesToEmbed, key);
			}
		} else {
			// If not in steganography mode, just create junk images
			for (let i = 0; i < images.length; i++) {
				images[i] = await createJunkImage(images[i]);
			}
		}

		uploadPost.mutateAsync({
			caption,
			images: await Promise.all(
				images.map(async (image) => {
					const imgForm = new FormData();
					imgForm.append('image', image);
					const response = await api.post('/posts/upload-image', imgForm, {
						headers: { 'Content-Type': 'multipart/form-data' },
					});
					return response.data.path;
				}),
			),
		});

		setIsLoading(false);
	};

	return (
		<div className="p-6 max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-6">Create Post</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="image">Image</Label>
					<Input name="image" type="file" accept="image/*" multiple required />
				</div>

				<div className="space-y-2">
					<Label htmlFor="caption">Caption</Label>
					<Input
						name="caption"
						type="text"
						placeholder="Write a caption..."
						required
					/>
				</div>

				{sMode && (
					<div className="space-y-2">
						<Label htmlFor="hidden-message">Hidden Message</Label>
						<Input
							name="h-message"
							type="file"
							placeholder="..."
							multiple
							required
						/>
					</div>
				)}

				{sMode && (
					<div className="space-y-2">
						<Label htmlFor="key">Key</Label>
						<Input name="h-key" type="text" placeholder="..." required />
					</div>
				)}

				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? 'Uploading...' : 'Upload'}
				</Button>
			</form>
		</div>
	);
}
