"use server"

import { registerUserService } from "@/lib/strapi"
import { SignupFormSchema, type FormState } from "@/validations/auth"
import z from "zod"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const cookieConfig = {
    maxAge: 60 * 60 * 24 * 7, // Una semana
    httpOnly: true, // Esto es para que solo se vea desde el servidor 
    path: '/',
    domain: process.env.HOST ?? 'localhost',
    secure: process.env.NODE_ENV === 'production'
}

export async function registerUserAction(prevSate: FormState, formData: FormData): Promise<FormState> {
    console.log('Hello from Register User Action')

    const fields = {
        username: formData.get('username') as string,
        password: formData.get('password') as string,
        email: formData.get('email') as string
    }

    console.log(fields)
    // return {
    //     fields
    // }

    const validatedFields = SignupFormSchema.safeParse(fields)

    if (!validatedFields.success) {
        const flattenedErrors = z.flattenError(validatedFields.error)
        console.log("Validation Errors:", flattenedErrors.fieldErrors)
        return {
            success: false,
            message: "Validarion error",
            // EN LA VIDA REAL NO DEBEMOS PONER EN LAS VARIABLES LOS NOMBRES REALES DE NUESTROS PAQUETES
            // por temas de seguridad
            strapiErrors: null,
            zodErrors: flattenedErrors.fieldErrors,
            data: {
                ...prevSate.data,
                ...fields
            }
        }
    }

    console.log('Validation successful')
    console.log('Fields', fields)

    // PASAMOS A REGISTRAR EL USUARIO EN STRAPI
    const response = await registerUserService(validatedFields.data)

    if (!response || response.error) {
        return {
            success: false,
            message: "Registration error",
            // EN LA VIDA REAL NO DEBEMOS PONER EN LAS VARIABLES LOS NOMBRES REALES DE NUESTROS PAQUETES
            // por temas de seguridad
            strapiErrors: response?.error,
            zodErrors: null,
            // data: {
            //     ...prevSate.data,
            //     ...fields
            // }
            data: fields
        }

    }

    console.log('Registration successful')

    const cookieStore = await cookies()
    cookieStore.set('jwt', response.jwt, cookieConfig)

    redirect('/dashboard')


    // return {
    //     success: true,
    //     message: "Validation successful",
    //     strapiErrors: null,
    //     zodErrors: null,
    //     // data: {
    //     //     ...prevSate.data,
    //     //     ...fields
    //     // }
    //     data: fields
    // }
}

// export async function registerUserAction(prevSate: {
//     fields: {
//         name: string,
//         password: string,
//         email: string
//     }
// }, formData: FormData) {
//     console.log('Hello from Register User Action')

//     const fields = {
//         username: formData.get('username') as string,
//         password: formData.get('password') as string,
//         email: formData.get('email') as string
//     }

//     console.log(fields)
//     return {
//         fields
//     }
// }