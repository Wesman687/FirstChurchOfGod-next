import HomeBottom from "@/components/home/HomeBottom";
import HomeMission from "@/components/home/HomeMission";
import HomeToAction from "@/components/home/HomeToAction";
import HomeWelcome from "@/components/home/HomeWelcome";
import Testimonial from "@/components/home/Testimonial";
import HeaderSlide from "@/components/slides/HeaderSlide";



export default function Home() {
  return (
    <>

      <div class="page_content_wrap page_paddings_no">
        <div class="content">
          <article class="post_item post_item_single page">
            <section class="post_content">
              <HeaderSlide />
              <HomeWelcome />
              <HomeMission />
              <HomeToAction />
              <Testimonial />
              <HomeBottom />
            </section>
          </article>
        </div>
      </div>
    </>
  );
}
