'use client';

import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SModeContext } from '../layout';

export default function UploadPage() {
	const [isLoading, setIsLoading] = useState(false);
	const sMode = useContext(SModeContext);

	console.log(sMode);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		// Handle form submission here
		setTimeout(() => setIsLoading(false), 1000);
	};

	return (
		<div className="p-6 max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-6">Create Post</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="image">Image</Label>
					<Input id="image" type="file" accept="image/*" required />
				</div>

				<div className="space-y-2">
					<Label htmlFor="caption">Caption</Label>
					<Input
						id="caption"
						type="text"
						placeholder="Write a caption..."
						required
					/>
				</div>

				{sMode && (
					<div className="space-y-2">
						<Label htmlFor="hidden-message">Hidden Message</Label>
						<Input id="hidden-message" type="text" placeholder="..." required />
					</div>
				)}

				{sMode && (
					<div className="space-y-2">
						<Label htmlFor="key">Key</Label>
						<Input id="key" type="text" placeholder="..." required />
					</div>
				)}

				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? 'Uploading...' : 'Upload'}
				</Button>
			</form>
		</div>
	);
}
