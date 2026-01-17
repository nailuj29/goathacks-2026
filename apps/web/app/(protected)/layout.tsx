'use client';

import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	if (isLoading) {
		return <div></div>;
	}

	if (!isAuthenticated && !isLoading) {
		router.push('/login');
	}

	return <>{children}</>;
}
