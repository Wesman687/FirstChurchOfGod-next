import HomeBottom from "@/components/home/HomeBottom";
import HomeMeetings from "@/components/home/HomeMeetings";
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
              <HomeMeetings />
              <HomeMission />
              <HomeToAction />
              {/* <Testimonial /> */}
              <HomeBottom />
      </div>
      </Layout>
    </>
  );
}
