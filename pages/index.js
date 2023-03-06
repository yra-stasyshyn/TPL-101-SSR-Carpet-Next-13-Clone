/* eslint-disable @next/next/no-page-custom-font */
import axios from "axios";
import Head from "next/head";
import PageGenerator from "../generator/PageGenerator";

export default function Home({ data, DOMAIN, images }) {
  
  // GOOGLE SEARCH CONSOLE
  const metaElem = data.google_search_console
  const propsList = metaElem.replace("<meta ", "").replace(" />", "").split(" ").map(item => item.split("=").map(item => item.replaceAll("\"", "")))
  const metaProps = Object.fromEntries(propsList)

  return (
    <>
      <Head>
        <title>{data.meta_title}</title>
        <meta name="description" content={data.meta_description} />
        <link rel="canonical" href={`https://www.${DOMAIN}`} />
        {Object.entries(data.schemas).map(([id, schema]) => {
          return (
            <script
              key={id}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema)
                  .replaceAll("[current_url]", DOMAIN)
                  .replaceAll("[phone]", data.phone),
              }}
            />
          );
        })}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: data.google_tag_manager_header.replace("<script>", "").replace("</script>", "") }}
        />
        <meta {...metaProps} />
      </Head>
      <div 
        dangerouslySetInnerHTML={{ __html: data.google_tag_manager_body.replace("<noscript>", "").replace("</noscript>", "") }}
      />
      <PageGenerator data={data} DOMAIN={DOMAIN} images={images} />
      <script
        id="passive"
        dangerouslySetInnerHTML={{
          __html: `
            const elements = document.querySelectorAll('*');

            elements.forEach(element => {
              element.addEventListener('scroll', null, { passive: true });
            });
          `,
        }}
      />

    </>
  );
}

export const getServerSideProps = async ({req}) => {
  const domain = req.headers["x-forwarded-host"].indexOf("amplifyapp.com") > 0 ? "riversidetowing.us" : req.headers["x-forwarded-host"].replace("https://", "").replace("http://", "").replace("www.", "")
  const data = await axios(
    `${process.env.API_URL}/api/site?${new URLSearchParams({
      domain: domain,
      type: "contact"
    }).toString()}`
  );
  const images = await axios(`${process.env.API_URL}/api/template-images/domain?domain=${domain}`);

  return {
    props: {
      data,
      DOMAIN: domain,
      images
    },
  };
};
