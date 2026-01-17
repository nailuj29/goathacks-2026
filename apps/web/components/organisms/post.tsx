'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import CommentsDialog from './commentsDialog';
import HiddenDialog from './hiddenDialog';
import { useState } from 'react';

interface PostProps {
	postId: string;
	username: string;
	userHandle: string;
	avatarUrl: string;
	avatarFallback: string;
	imageUrl: string;
	caption: string;
}

export default function Post({
	username,
	userHandle,
	avatarUrl,
	avatarFallback,
	imageUrl,
	caption,
	postId,
}: PostProps) {
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [showHiddenDialog, setShowHiddenDialog] = useState(false);

	return (
		<>
			<div className="border rounded-lg overflow-hidden">
				<div className="p-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarImage src={avatarUrl} />
							<AvatarFallback>{avatarFallback}</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-semibold text-sm">{username}</p>
							<p className="text-xs text-gray-500">{userHandle}</p>
						</div>
					</div>
					<Button variant="outline" size="sm">
						Follow
					</Button>
				</div>

				<div className="relative w-full aspect-square">
					<Image src={imageUrl} alt="Post" fill className="object-cover" />
				</div>

				<div className="p-4 flex items-start justify-between">
					<div className="flex-1">
						<p className="text-sm">
							<span className="font-semibold">{username}</span> {caption}
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							setCommentsOpen(true);
						}}
						className="ml-2"
					>
						<MessageCircle className="w-5 h-5" />
					</Button>
				</div>
			</div>

			<CommentsDialog
				open={commentsOpen}
				onOpenChange={setCommentsOpen}
				onShowHidden={() => {
					setCommentsOpen(false);
					setShowHiddenDialog(true);
				}}
			/>
			<HiddenDialog
				open={showHiddenDialog}
				onOpenChange={setShowHiddenDialog}
			/>
		</>
	);
}
