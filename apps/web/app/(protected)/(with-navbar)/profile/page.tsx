import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
	return (
		<div className="w-full p-6 space-y-6">
			<div className="flex flex-row gap-4 items-center justify-start border-b pb-4">
				<Avatar className="w-18 h-18">
					<AvatarImage src="" />
					<AvatarFallback>JD</AvatarFallback>
				</Avatar>
				<div className="flex-1">
					<p className="text-2xl font-semibold">@johndoe</p>
					<p className="text-sm text-gray-700">Bio goes here idk</p>
				</div>
				<div className="text-center">
					<p className="text-lg font-semibold">67</p>
					<p className="text-xs text-gray-500">Posts</p>
				</div>
			</div>
		</div>
	);
}
