import api from '@/lib/api';
import { APIUser } from '@/lib/backendtypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useLogout() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async () => {
			localStorage.removeItem('authToken');
			queryClient.invalidateQueries({ queryKey: ['me'] });
			router.push('/login');
		},
	}).mutateAsync;
}

export function useLogin() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async (credentials: { username: string; password: string }) => {
			const response = api.post('/users/login', credentials);
			return response;
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['me'] });
			localStorage.setItem('authToken', response.data.token);
			router.push('/home');
		},
	}).mutateAsync;
}

export function useAuth() {
	const currentUser = useQuery({
		queryKey: ['me'],
		queryFn: async (): Promise<APIUser> => {
			return api.get('/users/me').then((res) => res.data);
		},
		retry: false, // Don't retry on auth failures
		retryOnMount: false,
		refetchOnWindowFocus: false,
	});

	const isLoading = currentUser.isLoading;
	const isAuthenticated = !currentUser.isError && currentUser?.data != null;
	const user = currentUser.data;

	return {
		isLoading,
		isAuthenticated,
		user,
	};
}
