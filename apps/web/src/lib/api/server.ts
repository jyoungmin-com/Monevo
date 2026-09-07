import "server-only";

import { randomUUID } from "node:crypto";

import { currentAccessToken } from "@/lib/amplify/server";
import { backendApiUrl } from "@/lib/env";

import { appendQuery, unwrap, type QueryValue } from "./http";

export interface ServerRequestOptions {
	query?: Record<string, QueryValue>;
	locale?: string;
}

function apiUrl(path: string, query: ServerRequestOptions["query"]): URL {
	const url = new URL(`/api/v1/${path.replace(/^\/+/, "")}`, backendApiUrl());
	appendQuery(url.searchParams, query);
	return url;
}

export async function apiGet<T>(path: string, options: ServerRequestOptions = {}): Promise<T> {
	const headers = new Headers({ "x-request-id": randomUUID() });
	if (options.locale) headers.set("accept-language", options.locale);

	const token = await currentAccessToken();
	if (token) headers.set("authorization", `Bearer ${token}`);

	const response = await fetch(apiUrl(path, options.query), { headers, cache: "no-store" });
	return unwrap<T>(response);
}

export async function publicApiGet<T>(path: string, revalidate: number): Promise<T> {
	const response = await fetch(apiUrl(path, undefined), { next: { revalidate } });
	return unwrap<T>(response);
}
