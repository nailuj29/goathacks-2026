'use client';

import Post from '@/components/organisms/post';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/api';
import { APIPost } from '@/lib/backendtypes';
import { useQuery } from '@tanstack/react-query';

export default function HomePage() {
	const posts = useQuery({
		queryKey: ['feed-posts'],
		queryFn: async (): Promise<APIPost[]> => {
			const res = await api.get('/posts/all');
			return res.data;
		},
	});

	if (posts.isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Spinner className="text-gray-500" />
			</div>
		);
	}

	return (
		<div className="bg-white">
			<div className="space-y-6 p-4">
				{posts.data?.map((post, index: number) => (
					<Post key={index} post={post} />
				))}
			</div>
		</div>
	);
}
