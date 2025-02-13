import HomeBottom from "@/components/home/HomeBottom";
import HomeMission from "@/components/home/HomeMission";
import HomeToAction from "@/components/home/HomeToAction";
import HomeWelcome from "@/components/home/HomeWelcome";
import Layout from "@/components/Layout";



export default function Home() {
  return (
    <>
      <Layout>
      <div className="webpage-container">
              <HomeWelcome />
              <HomeMission />
              <HomeToAction />
              {/* <Testimonial /> */}
              <HomeBottom />
      </div>
      </Layout>
    </>
  );
}
