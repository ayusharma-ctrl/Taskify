import { cookies } from "next/headers";
import { NextRequest, NextResponse} from "next/server";

async function checkUserAuthentication(): Promise<boolean> {
    const cookie = cookies().get("auth-token")?.value;
    if (!cookie) return false;
    return true;
}

export async function middleware(request: NextRequest) {
    const userAuthenticated = await checkUserAuthentication();
    const currentPath = request.nextUrl.pathname;

    if (!userAuthenticated && currentPath.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (userAuthenticated && currentPath === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    return NextResponse.next();
}