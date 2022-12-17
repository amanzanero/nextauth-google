import SvelteKitAuth from '@auth/sveltekit';
import { authOptions } from '$lib/auth/options';

export const handle = SvelteKitAuth(authOptions);

