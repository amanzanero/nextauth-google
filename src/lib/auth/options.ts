import type { SvelteKitAuthOptions } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } from '$env/static/private';
import { PrismaAdapter } from '$lib/db/authadapter';
import { prisma } from '$lib/db/client';

export const authOptions: SvelteKitAuthOptions = {
	providers: [Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })],
	adapter: PrismaAdapter(prisma),
	secret: AUTH_SECRET,
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			if (url.startsWith('/')) return `${baseUrl}${url}`;
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		}
	},
	debug: true
};
