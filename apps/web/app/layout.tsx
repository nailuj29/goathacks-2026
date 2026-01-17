import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/lib/providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Stenogram',
	description: 'Nothing covert to see here!',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-screen overflow-hidden">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-125 mx-auto h-screen overflow-hidden`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
