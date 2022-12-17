import type { Adapter } from '@auth/core/adapters';
import type { PrismaClient } from '@prisma/client';

export const PrismaAdapter: (client: PrismaClient) => Adapter = (client) => {
	return {
		createUser: (user) => client.user.create({ data: user }),
		getUser: (id: string) => client.user.findUnique({ where: { id } }),
		getUserByEmail: (email: string) => client.user.findUnique({ where: { email } }),
		// /** Using the provider id and the id of the user for a specific account, get the user. */
		getUserByAccount: async (provider_providerAccountId) => {
			console.log({ provider_providerAccountId });
			const account = await client.account.findUnique({
				where: { provider_providerAccountId },
				select: { user: true }
			});
			console.log({ account });
			return account?.user;
		},
		updateUser: ({ id, ...data }) => client.user.update({ where: { id }, data }),
		deleteUser: (id) => client.user.delete({ where: { id } }),
		linkAccount: (data) => client.account.create({ data }),
		unlinkAccount: (provider_providerAccountId) =>
			client.account.delete({
				where: { provider_providerAccountId }
			}),
		async getSessionAndUser(sessionToken) {
			const userAndSession = await client.session.findUnique({
				where: { sessionToken },
				include: { user: true }
			});
			console.log({ userAndSession });
			if (!userAndSession) return null;
			const { user, ...session } = userAndSession;
			return { user, session };
		},
		createSession: (data) => client.session.create({ data }),
		updateSession: (data) =>
			client.session.update({ where: { sessionToken: data.sessionToken }, data }),
		deleteSession: (sessionToken) => client.session.delete({ where: { sessionToken } }),
		async createVerificationToken(data) {
			const verificationToken = await client.verificationToken.create({ data });
			// @ts-expect-errors // MongoDB needs an ID, but we don't
			if (verificationToken.id) delete verificationToken.id;
			return verificationToken;
		},
		async useVerificationToken(identifier_token) {
			try {
				const verificationToken = await client.verificationToken.delete({
					where: { identifier_token }
				});
				// @ts-expect-errors // MongoDB needs an ID, but we don't
				if (verificationToken.id) delete verificationToken.id;
				return verificationToken;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				// If token already used/deleted, just return null
				// https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
				if (error.code === 'P2025') return null;
				throw error;
			}
		}
	} as Adapter;
};
