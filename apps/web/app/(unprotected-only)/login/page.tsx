'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/auth';
import { AxiosError } from 'axios';
import { useState } from 'react';

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const login = useLogin();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		try {
			await login({ username, password });
			setError(null);
		} catch (err) {
			if (err instanceof AxiosError) {
				setError(err.response?.data?.message || 'Unknown error');
			}
		}

		setIsLoading(false);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-white">
			<div className="w-full max-w-sm px-6">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold">Stenogram</h1>
					<p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input
							name="username"
							type="text"
							placeholder="Enter your username"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							name="password"
							type="password"
							placeholder="Enter your password"
							required
						/>
					</div>

					{error && (
						<p className="text-red-500 text-sm">Login failed: {error}</p>
					)}

					<Button type="submit" className="w-full mt-6" disabled={isLoading}>
						{isLoading ? 'Signing in...' : 'Sign in'}
					</Button>
				</form>

				<div className="text-center mt-6">
					<p className="text-sm text-gray-500">
						Don&apos;t have an account?{' '}
						<a
							href="/signup"
							className="text-blue-600 hover:underline font-medium"
						>
							Sign up
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
