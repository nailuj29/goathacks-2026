'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		const username = formData.get('username') as string;
		const name = formData.get('name') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			setIsLoading(false);
			return;
		}

		console.log({ username, name, password });

		try {
			await api.post('/users/register', { username, name, password });
			setError(null);
			router.push('/login');
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
					<p className="text-gray-500 text-sm mt-2">Create a new account</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input
							name="username"
							type="text"
							placeholder="Choose a username"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							name="name"
							type="text"
							placeholder="Enter your name"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							name="password"
							type="password"
							placeholder="Create a password"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							name="confirmPassword"
							type="password"
							placeholder="Confirm your password"
							required
						/>
					</div>

					{error && <p className="text-red-500 text-sm">{error}</p>}

					<Button type="submit" className="w-full mt-6" disabled={isLoading}>
						{isLoading ? 'Creating account...' : 'Sign up'}
					</Button>
				</form>

				<div className="text-center mt-6">
					<p className="text-sm text-gray-500">
						Already have an account?{' '}
						<a
							href="/login"
							className="text-blue-600 hover:underline font-medium"
						>
							Sign in
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
