import api from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useLogin() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async (credentials: { username: string; password: string }) => {
			const response = api.post('/users/login', credentials);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['me'] });
			router.push('/home');
		},
	}).mutateAsync;
}

export function useAuth() {
	const currentUser = useQuery({
		queryKey: ['me'],
		queryFn: async () => {
			return api.get('/users/me').then((res) => res.data);
		},
	});

	const isLoading = currentUser.isLoading;
	const isAuthenticated = currentUser?.data != null;
	const user = currentUser.data;

	return {
		isLoading,
		isAuthenticated,
		user,
	};
}
