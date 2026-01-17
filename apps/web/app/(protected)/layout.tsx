'use client';

import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated && !isLoading) {
			router.push('/login');
		}
	}, [isAuthenticated, isLoading, router]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-white">
				<Spinner />
			</div>
		);
	}

	if (!isAuthenticated && !isLoading) {
		return null;
	}

	return <>{children}</>;
}
