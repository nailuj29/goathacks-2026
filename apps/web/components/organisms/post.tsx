'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import CommentsDialog from './commentsDialog';
import HiddenDialog from './hiddenDialog';
import { useState } from 'react';

interface PostProps {
	post: APIPost;
}

export default function Post({ post }: PostProps) {
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [showHiddenDialog, setShowHiddenDialog] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const imageCount = post.images.length;
	const canGoPrev = currentImageIndex > 0;
	const canGoNext = currentImageIndex < imageCount - 1;

	const goToPrevious = () => {
		if (canGoPrev) setCurrentImageIndex(currentImageIndex - 1);
	};

	const goToNext = () => {
		if (canGoNext) setCurrentImageIndex(currentImageIndex + 1);
	};

	return (
		<>
			<div className="border rounded-lg overflow-hidden">
				<div className="p-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-semibold text-sm">{post.author.name}</p>
							<p className="text-xs text-gray-500">@{post.author.username}</p>
						</div>
					</div>
				</div>

				<div className="relative w-full aspect-square bg-gray-100 group">
					<Image
						key={currentImageIndex}
						src={
							process.env.NEXT_PUBLIC_API_BASE_URL +
							post.images[currentImageIndex]
						}
						alt={`Post image ${currentImageIndex + 1}`}
						fill
						className="object-cover transition-opacity duration-300"
						unoptimized
					/>

					{/* Navigation Buttons */}
					{imageCount > 1 && (
						<>
							<Button
								variant="ghost"
								size="icon"
								onClick={goToPrevious}
								disabled={!canGoPrev}
								className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
							>
								<ChevronLeft className="w-5 h-5" />
							</Button>

							<Button
								variant="ghost"
								size="icon"
								onClick={goToNext}
								disabled={!canGoNext}
								className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
							>
								<ChevronRight className="w-5 h-5" />
							</Button>

							{/* Image Indicators */}
							<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
								{post.images.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentImageIndex(index)}
										className={`w-2 h-2 rounded-full transition-all ${
											index === currentImageIndex
												? 'bg-white w-6'
												: 'bg-white/50 hover:bg-white/75'
										}`}
										aria-label={`Go to image ${index + 1}`}
									/>
								))}
							</div>

							{/* Image Counter */}
							<div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
								{currentImageIndex + 1} / {imageCount}
							</div>
						</>
					)}
				</div>

				<div className="p-4 flex flex-row flex-nowrap items-center justify-between gap-2">
					<p className="text-sm flex-1 min-w-0">
						<span className="font-semibold">{post.author.name}</span>{' '}
						{post.caption}
					</p>

					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							setCommentsOpen(true);
						}}
						className="shrink-0"
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
				comments={post.comments}
				postId={post._id}
			/>
			<HiddenDialog
				open={showHiddenDialog}
				onOpenChange={setShowHiddenDialog}
			/>
		</>
	);
}
