'use client';

import CommentsDialog from '@/components/organisms/commentsDialog';
import Post from '@/components/organisms/post';
import { useState } from 'react';

const SAMPLE_POSTS = [
	{
		postId: 'post1',
		username: 'Sarah Chen',
		userHandle: '@sarahchen',
		avatarUrl: 'https://github.com/shadcn.png',
		avatarFallback: 'SC',
		imageUrl:
			'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
		caption: 'Mountain views hit different 🏔️',
	},
	{
		postId: 'post2',
		username: 'Alex Rivera',
		userHandle: '@alexrivera',
		avatarUrl: 'https://github.com/shadcn.png',
		avatarFallback: 'AR',
		imageUrl:
			'https://images.unsplash.com/photo-1714332818313-627551693dbc?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		caption: 'Coffee and coding 💻☕',
	},
	{
		postId: 'post3',
		username: 'Jordan Lee',
		userHandle: '@jordanlee',
		avatarUrl: 'https://github.com/shadcn.png',
		avatarFallback: 'JL',
		imageUrl:
			'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500&h=500&fit=crop',
		caption: 'Sunset sessions are unmatched 🌅',
	},
];

export default function HomePage() {
	const [commentsOpen, setCommentsOpen] = useState(false);

	return (
		<div className="bg-white">
			<div className="space-y-6 p-4">
				{SAMPLE_POSTS.map((post, index) => (
					<Post
						key={index}
						{...post}
						onCommentClick={() => setCommentsOpen(true)}
					/>
				))}
			</div>

			<CommentsDialog open={commentsOpen} onOpenChange={setCommentsOpen} />
		</div>
	);
}
