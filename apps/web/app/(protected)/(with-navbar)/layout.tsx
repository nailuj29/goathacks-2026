'use client';

import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/auth';
import { CircleUser, HomeIcon, PlusIcon, LogOutIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, createContext, useEffect } from 'react';

export const SModeContext = createContext(false);

// Customizable button sequence: 'home', 'profile', 'upload' triggers sMode
const UNLOCK_SEQUENCE = ['home', 'upload', 'home', 'upload', 'home', 'upload'];
const SEQUENCE_TIMEOUT = 2000; // milliseconds

export default function NavbarLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [sMode, setSMode] = useState(false);
	const [buttonSequence, setButtonSequence] = useState<string[]>([]);
	const logout = useLogout();

	// Reset sequence after timeout
	useEffect(() => {
		if (buttonSequence.length === 0) return;

		const timer = setTimeout(() => {
			setButtonSequence([]);
		}, SEQUENCE_TIMEOUT);

		return () => clearTimeout(timer);
	}, [buttonSequence]);

	const handleButtonClick = (buttonId: string) => {
		const newSequence = [...buttonSequence, buttonId];
		const expectedButton = UNLOCK_SEQUENCE[newSequence.length - 1];

		if (buttonId === expectedButton) {
			if (newSequence.length === UNLOCK_SEQUENCE.length) {
				// Sequence complete!
				setSMode(true);
				setButtonSequence([]);
			} else {
				// Sequence in progress
				setSMode(false);
				setButtonSequence(newSequence);
			}
		} else {
			// Wrong button, reset sequence
			setSMode(false);
			setButtonSequence([]);
		}
	};

	const isActive = (path: string) => pathname === path;

	return (
		<SModeContext.Provider value={sMode}>
			<div className="flex flex-col h-screen">
				<div className="flex-1 overflow-auto">{children}</div>
				<div className="border-t py-4 px-4 flex gap-2 justify-center">
					<Button
						size="icon-lg"
						onClick={() => {
							handleButtonClick('home');
							router.push('/home');
						}}
						variant={isActive('/home') ? 'default' : 'outline'}
					>
						<HomeIcon />
					</Button>
					<Button
						size="icon-lg"
						onClick={() => {
							handleButtonClick('upload');
							router.push('/upload');
						}}
						variant={isActive('/upload') ? 'default' : 'outline'}
					>
						<PlusIcon />
					</Button>
					<Button
						size="icon-lg"
						onClick={() => {
							handleButtonClick('profile');
							router.push('/profile');
						}}
						variant={isActive('/profile') ? 'default' : 'outline'}
					>
						<CircleUser />
					</Button>
					<Button
						size="icon-lg"
						onClick={async () => {
							handleButtonClick('logout');
							await logout();
						}}
						variant="ghost"
					>
						<LogOutIcon />
					</Button>
				</div>
			</div>
		</SModeContext.Provider>
	);
}
