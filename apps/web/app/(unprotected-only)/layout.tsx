'use client';

import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NoAuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated && !isLoading) {
			router.push('/home');
		}
	}, [isAuthenticated, isLoading, router]);

	if (isAuthenticated && !isLoading) {
		return null;
	}

	return <>{children}</>;
}
