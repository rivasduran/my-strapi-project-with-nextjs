import { HeroSection } from "@/components/hero-sections";
import { getHomePage } from "@/lib/strapi";

// export const metadata = {
//   title: "Home",
//   description: "Home Page",
// };

export async function generateMetadata() {
  const data = await getHomePage();
  const { Title, Descripcion } = data.data;

  return {
    title: Title,
    description: Descripcion,
  };
}
export default async function Home() {
  const data = await getHomePage();
  console.log(data);
  const { Title, Descripcion } = data.data;

  const strapiData = data.data;

  const [heroSection] = strapiData?.sections || []


  return (
    <main className="container mx-auto py-6">

      {/* <h1 className="text-3xl font-bold">{Title}</h1>
      <p className="text-gray-600">{Descripcion}</p>
      <HeroSection data={data.data.sections[0]} /> */}
      <HeroSection data={heroSection} />
    </main>
  );
}
