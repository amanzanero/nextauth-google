import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const sessionPromise = event.locals.getSession();
	return {
		session: await sessionPromise
	};
};
