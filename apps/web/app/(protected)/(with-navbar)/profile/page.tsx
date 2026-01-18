'use client';

import Post from '@/components/organisms/post';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/auth';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function ProfilePage() {
	const { user, isLoading } = useAuth();

	const posts = useQuery({
		queryKey: ['me-posts'],
		queryFn: async (): Promise<APIPost[]> => {
			const res = await api.get(`/posts/me`);
			return res.data;
		},
	});

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (!user) {
		return <p>Error fetching user somehow.</p>;
	}

	return (
		<div className="w-full p-6 space-y-6">
			<div className="sticky top-0 bg-white z-10 flex flex-row gap-4 items-center justify-start border-b pb-4 p-4">
				<div className="flex-1">
					<p className="text-2xl font-semibold">{user.name}</p>
					<p className="text-sm text-gray-700">@{user.username}</p>
				</div>
				<div className="text-center">
					<p className="text-lg font-semibold">{posts.data?.length || 0}</p>
					<p className="text-xs text-gray-500">Posts</p>
				</div>
			</div>
			<div className="space-y-4">
				{posts.isLoading ? (
					<div className="flex h-32 items-center justify-center">
						<Spinner />
					</div>
				) : posts.data && posts.data.length > 0 ? (
					posts.data.map((post, index) => <Post key={index} post={post} />)
				) : (
					<p className="text-gray-500">No posts to display.</p>
				)}
			</div>
		</div>
	);
}
