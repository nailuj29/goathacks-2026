'use client';

import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SModeContext } from '../layout';
import { createStegImage, decryptStegImage } from '@/lib/stegano';

export default function UploadPage() {
	const [isLoading, setIsLoading] = useState(false);
	const sMode = useContext(SModeContext);

	console.log(sMode);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		let image = formData.get('image') as File;
		const caption = formData.get('caption') as string;
		const hiddenMessage = formData.get('h-message') as File | null;
		const key = formData.get('h-key') as string | null;

		if (sMode && hiddenMessage && key) {
			image = await createStegImage(image, [hiddenMessage], key);
		}

		setIsLoading(false);
	};

	return (
		<div className="p-6 max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-6">Create Post</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="image">Image</Label>
					<Input name="image" type="file" accept="image/*" required />
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
						<Input name="h-message" type="file" placeholder="..." required />
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
