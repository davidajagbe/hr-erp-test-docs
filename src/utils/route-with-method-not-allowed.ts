import type { RequestHandler, Router } from "express";
import methodNotAllowed from "../middleware/method-not-allowed";

// note: this code here is a wrapper for the router, if you don't want to always add the methodNotAllowed middleware to every route, you can use this function

/**
 * Example Usage:
 * routeWithNotAllowed(router, "/", {
   get: [isAuth, AuthController.getUser],
 });
 */

type HTTPMethod = "get" | "post" | "put" | "patch" | "delete";

interface RouteHandlers {
	[method: string]: RequestHandler[];
}

export const routeWithNotAllowed = (
	router: Router,
	path: string,
	handlers: Partial<Record<HTTPMethod, RequestHandler[]>>,
): void => {
	const route = router.route(path);

	for (const method in handlers) {
		const typedMethod = method as HTTPMethod;
		if (typeof route[typedMethod] === "function" && handlers[typedMethod]) {
			route[typedMethod](...(handlers[typedMethod] as RequestHandler[]));
		}
	}

	route.all(methodNotAllowed);
};
