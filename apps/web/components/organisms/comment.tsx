import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface CommentProps {
	username: string;
	avatarUrl: string;
	avatarFallback: string;
	text: string;
	timestamp?: string;
}

export default function Comment({
	username,
	avatarUrl,
	avatarFallback,
	text,
	timestamp,
}: CommentProps) {
	return (
		<div className="flex gap-3 py-3">
			<Avatar className="w-8 h-8">
				<AvatarImage src={avatarUrl} />
				<AvatarFallback>{avatarFallback}</AvatarFallback>
			</Avatar>
			<div className="flex-1">
				<div className="flex items-baseline gap-2">
					<p className="font-semibold text-sm">{username}</p>
					{timestamp && <p className="text-xs text-gray-500">{timestamp}</p>}
				</div>
				<p className="text-sm text-gray-800 mt-1">{text}</p>
			</div>
		</div>
	);
}
