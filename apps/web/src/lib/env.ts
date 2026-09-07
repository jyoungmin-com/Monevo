import "server-only";

export interface PublicConfig {
	region: string;
	userPoolId: string;
	userPoolClientId: string;
	appEnv: "dev" | "staging" | "prod";
}

function required(name: string): string {
	const value = process.env[name];
	if (!value) {

		throw new Error(`missing env ${name}`);
	}
	return value;
}

export function publicConfig(): PublicConfig {
	const appEnv = process.env.APP_ENV ?? "dev";
	if (appEnv !== "dev" && appEnv !== "staging" && appEnv !== "prod") {
		throw new Error(`APP_ENV must be dev | staging | prod, got ${appEnv}`);
	}
	return {
		region: process.env.AWS_REGION ?? "us-east-1",
		userPoolId: required("COGNITO_USER_POOL_ID"),
		userPoolClientId: required("COGNITO_APP_CLIENT_ID"),
		appEnv,
	};
}

export function backendApiUrl(): string {
	return required("BACKEND_API_URL").replace(/\/+$/, "");
}
