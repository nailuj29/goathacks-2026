'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function LoginPage() {
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
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold">Stenogram</h1>
					<p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Username */}
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							type="text"
							placeholder="Enter your username"
							required
						/>
					</div>

					{/* Password */}
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="Enter your password"
							required
						/>
					</div>

					{/* Submit Button */}
					<Button type="submit" className="w-full mt-6" disabled={isLoading}>
						{isLoading ? 'Signing in...' : 'Sign in'}
					</Button>
				</form>

				{/* Footer */}
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
