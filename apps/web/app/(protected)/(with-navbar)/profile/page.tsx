import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
	return (
		<div className="w-full p-6 space-y-6">
			<div className="flex flex-col items-center space-y-4">
				<Avatar className="w-24 h-24">
					<AvatarImage src="" />
					<AvatarFallback>JD</AvatarFallback>
				</Avatar>
				<div className="text-center">
					<h1 className="text-2xl font-semibold">John Doe</h1>
					<p className="text-gray-500">@johndoe</p>
				</div>
			</div>

			<div className="text-center">
				<p className="text-sm text-gray-700">Bio goes here idk</p>
			</div>

			<div className="flex justify-around py-4 border-y">
				<div className="text-center">
					<p className="text-lg font-semibold">67</p>
					<p className="text-xs text-gray-500">Posts</p>
				</div>
				<div className="text-center">
					<p className="text-lg font-semibold">6.7k</p>
					<p className="text-xs text-gray-500">Followers</p>
				</div>
				<div className="text-center">
					<p className="text-lg font-semibold">2</p>
					<p className="text-xs text-gray-500">Following</p>
				</div>
			</div>

			<Button className="w-full">Follow</Button>
		</div>
	);
}
