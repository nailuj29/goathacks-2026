import { APIComment } from '@/lib/backendtypes';

export default function Comment({ comment }: { comment: APIComment }) {
	return (
		<div className="flex gap-3 py-3">
			<div className="flex-1">
				<div className="flex items-baseline gap-2">
					<p className="font-semibold text-sm">{comment.author.username}</p>
				</div>
				<p className="text-sm text-gray-800 mt-1">{comment.text}</p>
			</div>
		</div>
	);
}
