import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { ContactButton, Container, FullContainer } from "../common";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function Banner({ data, params, images, DOMAIN }) {
  const service = params?.service?.replace(`-${data.last_url_path}`, "");
  const bannerImagePath =
    !service || service.toLowerCase() === data.default_service.toLowerCase()
      ? "banner-bg"
      : `${service}-banner-bg`;
  const bannerImage = images.find((image) => image.tagName === bannerImagePath)
    ? images.find((image) => image.tagName === bannerImagePath)
    : images.find((image) => image.tagName === "banner-bg");
  return (
    <FullContainer className="lg:pt-5 text-white relative items-center justify-center">
      <Image
        src={`${process.env.IMAGE_PATH}${DOMAIN}/${bannerImage?.imageName}`}
        alt={bannerImage?.alt}
        title={bannerImage?.title}
        fill={true}
        loading="eager"
        objectFit="cover"
        className="-z-10 absolute"
      />
      <Container className="md:ml-12 lg:ml-14 py-6 lg:py-8 flex-col flex items-center justify-center">
        <div className="z-10 flex flex-col w-full">
          <ContactButton
            textClass="font-extrabold"
            className="relative py-3 px-1 !pl-10 !pr-5 lg:px-2 bg-primary text-white rounded-full text-start hover:bg-primary shadow-callBtn"
            data={data.phone}
            phoneClass="bg-white text-primary p-2 rounded-full absolute top-[-10px] left-[-10px] shadow-phoneIcon"
            phoneIconClass="h-5 lg:h-7"
          />
          {/* <div className="z-10 flex flex-col items-center justify-center w-full"> */}
          <div className="w-[100%] md:w-4/5 lg:w-[62%] max-w-screen-2xl mt-5 lg:mt-10 justify-center">
            <ReactMarkdown
              className="w-full py-2 text-3xl md:text-4xl lg:text-6xl font-extrabold uppercase text-center bg-white text-black"
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {data.current_city_title}
            </ReactMarkdown>
            <h1 className="py-2 text-2xl md:text-3xl lg:text-3xl font-extrabold uppercase text-center bg-primary text-white">
              <ReactMarkdown
                className="text-2xl lg:text-3xl font-extrabold mt-0 mb-0 text-white"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {data.meta_heading_h1}
              </ReactMarkdown>
            </h1>
          </div>
          <div className="sm:w-12/12 md:w-4/5 lg:w-[62%] max-w-screen-2xl grid md:grid-cols-2 gap-2 lg:gap-2 mt-5 lg:mt-10">
            {[...Array(9).keys()].map((item, index) => (
              <div
                key={index}
                className={`flex text-sm lg:text-base space-x-2  bg-white text-black p-2 items-center`}
              >
                <ChevronDoubleRightIcon className="h-5 bg-primary text-white" />

                <ReactMarkdown
                  className="text-left truncate"
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {data[`pros_${item + 1}`]}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </FullContainer>
  );
}
