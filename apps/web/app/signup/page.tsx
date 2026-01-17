'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function SignUpPage() {
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
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
							id="username"
							type="text"
							placeholder="Choose a username"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="Enter your email"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="Create a password"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							type="password"
							placeholder="Confirm your password"
							required
						/>
					</div>

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
