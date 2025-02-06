import HomeBottom from "@/components/home/HomeBottom";
import HomeMission from "@/components/home/HomeMission";
import HomeToAction from "@/components/home/HomeToAction";
import HomeWelcome from "@/components/home/HomeWelcome";
import Testimonial from "@/components/home/Testimonial";
import Layout from "@/components/Layout";
import HeaderSlide from "@/components/slides/HeaderSlide";



export default function Home() {
  return (
    <>
      <Layout>
      <div className="page_content_wrap page_paddings_no">
        <div className="content">
          <article className="post_item post_item_single page">
            <section className="post_content">
              <HeaderSlide />
              <HomeWelcome />
              <HomeMission />
              <HomeToAction />
              {/* <Testimonial /> */}
              <HomeBottom />
            </section>
          </article>
        </div>
      </div>
      </Layout>
    </>
  );
}
