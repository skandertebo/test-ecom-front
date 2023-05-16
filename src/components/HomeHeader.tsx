import { Swiper, SwiperSlide } from "swiper/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Autoplay, Pagination, Scrollbar, A11y } from "swiper";
import sliderbackground1 from "../assets/images/home-slider1.avif";
import sliderbackground2 from "../assets/images/home-slider2.avif";
import sliderbackground3 from "../assets/images/home-slider3.avif";
import sliderbackground4 from "../assets/images/home-slider4.avif";
import "swiper/css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Typography } from "@material-tailwind/react";
import { useCallback } from "react";

const slides = [
  {
    title: "",
    description: "",
    link: "",
    background: sliderbackground1
  },
  {
    title: "",
    description: "",
    link: "",
    background: sliderbackground2
  },
  {
    title: "",
    description: "",
    link: "",
    background: sliderbackground3
  },
  {
    title: "",
    description: "",
    link: "",
    background: sliderbackground4
  }
];

export default function HomeHeader(): JSX.Element {
  const scrollDownToCatalog = useCallback(() => {
    const catalog = document.getElementById("catalogueSection");
    if (catalog) {
      catalog.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="px-2 flex flex-col gap-12 items-center justify-center lg:px-0 py-8 bg-primary h-[91vh]">
      <div className="h-full w-full">
        <Swiper
          modules={[Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false
          }}
          speed={2400}
          loop
          pagination={{ clickable: true }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[450px] bg-contain bg-no-repeat bg-center flex flex-col justify-center items-center"
                style={{
                  backgroundImage: `url(${slide.background})`
                }}
              >
                {slide.title && (
                  <h1 className="text-4xl text-white">{slide.title}</h1>
                )}
                {slide.description && (
                  <p className="text-white">{slide.description}</p>
                )}
                {slide.link && (
                  <a
                    href={slide.link}
                    className="bg-white text-black py-2 px-4 rounded-md"
                  >
                    Shop Now
                  </a>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <button
        onClick={scrollDownToCatalog}
        className="border border-blue-gray-50 rounded-md px-6 py-2 hover:bg-orange hover:border-orange transition-all"
      >
        <Typography variant="h3" className="text-white font-normal">
          Discover
        </Typography>
      </button>
    </div>
  );
}
