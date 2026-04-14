import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "./lib/strapi";

const protectedRoutes = ["/dashboard"];

function checkIsProtectedRoute(path: string) {
    return protectedRoutes.includes(path)
}


export async function proxy(request: NextRequest) {
    const currentPath = request.nextUrl.pathname

    const isprotectedRoute = checkIsProtectedRoute(currentPath)

    if (!isprotectedRoute) return NextResponse.next()

    // LA RUTA ES UNA RUTA PROTEGIDA POR LO QUE DEBEMOS VERIFICAR SI EL USUARIO ESTA AUTENTICADO
    try {
        // 1. Validar si el usuario tiene el token jwt
        // 2. Si el usuario existe en la base de datos
        // 3. Si el usuario esta activo
        const cookieStore = await cookies()
        const jwtToken = cookieStore.get('jwt')?.value

        if (!jwtToken) {
            return NextResponse.redirect(new URL('/signin', request.url))
        }

        const response = await fetch(`${BASE_URL}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        })

        const userResponse = await response.json()
        console.log(userResponse)

        if (!userResponse) {
            return NextResponse.redirect(new URL('/signin', request.url))
        }


        // LE DEJAMOS PASAR a la solicitud
        return NextResponse.next()


    } catch (error) {
        console.error('Error verifying user authentication:', error)
        return NextResponse.redirect(new URL('/signins', request.url))
    }
}


// vamos a devolver un matcher que nos dice realmente cuando debemos ejecutar esto
// para que no se llame en todas las rutas sino en unas especificas
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
        "/dashboard",
        "/dashboard/:path*",
    ]
}