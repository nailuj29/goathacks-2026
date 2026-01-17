'use client';

import { Button } from '@/components/ui/button';
import { CircleUser, HomeIcon, PlusIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, createContext } from 'react';

export const SModeContext = createContext(false);

export default function NavbarLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [startHoldTime, setStartHoldTime] = useState<number | null>(null);
	const [sMode, setSMode] = useState(false);

	const isActive = (path: string) => pathname === path;

	const onMouseUp = () => {
		if (startHoldTime !== null) {
			const holdDuration = Date.now() - startHoldTime;
			console.log('Hold duration:', holdDuration);
			if (holdDuration > 1500) {
				setSMode(true);
			} else {
				setSMode(false);
			}
			setStartHoldTime(null);
		}
	};

	return (
		<SModeContext.Provider value={sMode}>
			<div className="flex flex-col h-screen">
				<div className="flex-1 overflow-auto">{children}</div>
				<div className="border-t py-4 px-4 flex gap-2 justify-center">
					<Button
						size="icon-lg"
						onClick={() => router.push('/home')}
						variant={isActive('/home') ? 'default' : 'outline'}
					>
						<HomeIcon />
					</Button>
					<Button
						size="icon-lg"
						onMouseDown={() => setStartHoldTime(Date.now())}
						onMouseUp={onMouseUp}
						onClick={() => {
							localStorage.setItem('sMode', 'false');
							router.push('/upload');
						}}
						variant={isActive('/upload') ? 'default' : 'outline'}
					>
						<PlusIcon />
					</Button>
					<Button
						size="icon-lg"
						onClick={() => router.push('/profile')}
						variant={isActive('/profile') ? 'default' : 'outline'}
					>
						<CircleUser />
					</Button>
				</div>
			</div>
		</SModeContext.Provider>
	);
}
