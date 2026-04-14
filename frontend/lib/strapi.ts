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
    console.log(`Fetching from: ${BASE_URL}${url}`);
    try {
        const response = await fetch(`${BASE_URL}${url}`);
        if (!response.ok) {
            console.warn(`Fetch failed with status ${response.status}`);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
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