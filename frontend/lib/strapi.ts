import qs from 'qs';
// export const BASE_URL = 'http://localhost:1337';
import { CacheLife } from 'next/dist/server/use-cache/cache-life';
import { cacheLife } from 'next/cache';
export const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const QUERY_HOME_PAGE = {
    populate: {
        sections: {
            on: {
                "layout.hero-section": {
                    populate: {
                        image: {
                            fields: ["url", "alternativeText"]
                        },
                        link: {
                            populate: true
                        }
                    }
                }
            }
        }
    }
}

export async function getHomePage() {
    // 'use cache'
    // cacheLife({ expire: 60 })
    const query = qs.stringify(QUERY_HOME_PAGE);
    const response = await getStrapiData(`/api/home-page?${query}`);
    // console.log('-'.repeat(20));
    // console.log(response);
    // console.log('-'.repeat(20));
    return response;
}
export async function getStrapiData(url: string) {
    const fullUrl = `${BASE_URL}${url}`;
    console.log(`[Strapi Fetch] ${fullUrl}`);
    
    try {
        // Añadimos un tiempo de espera de 5 segundos para que el build no se cuelgue
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(fullUrl, {
            signal: controller.signal,
            cache: 'no-store' // Evitamos problemas de caché durante el debug del build
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.warn(`[Strapi Warn] ${fullUrl} returned ${response.status}`);
            return null;
        }
        
        return await response.json();
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error(`[Strapi Error] Timeout fetching ${fullUrl}`);
        } else {
            console.error(`[Strapi Error] Failed to fetch ${fullUrl}:`, error.message);
        }
        return null;
    }
}


// HACEMOS LA FUCNIONALIDAD DE REGISTRO
export async function registerUserService(userData: object) {
    const url = `${BASE_URL}/api/auth/local/register`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        console.log('Mira lo que llega del registro');
        console.log(response);
        // if (!response.ok) {
        //     throw Error(`HTTP error! status ${response.status}`);
        // }
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
        return null;
    }
}

// HACEMOS AHORA EL LOGIN  
export async function loginUserService(userData: object) {
    const url = `${BASE_URL}/api/auth/local`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Error login user:', error);
        throw error;
        return null;
    }
}