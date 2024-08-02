import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


async function checkUserAuthentication(request: NextRequest): Promise<boolean> {
    const cookie = request.cookies.get("auth-token");
    console.log("Cookie-name", cookie?.name);
    if (!cookie) return false;
    return true;
}

export async function middleware(request: NextRequest) {
    const userAuthenticated = await checkUserAuthentication(request);
    console.log("userAuthenticated", userAuthenticated);
    const currentPath = request.nextUrl.pathname;

    if (!userAuthenticated && currentPath.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (userAuthenticated && currentPath === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    return NextResponse.next();
}