/* eslint-disable @next/next/no-page-custom-font */
import axios from "axios";
import Head from "next/head";
import PageGenerator from "../generator/PageGenerator";
import { getDomainFromReqHeader } from "../helpers/getDomainFromReqHeader";
import { getImagesOfDomain } from "../helpers/getImagesOfDomain";

export default function Page({ data, breadcrumbs, DOMAIN, images }) {
  
  // GOOGLE SEARCH CONSOLE
  const metaElem = data.google_search_console
  const propsList = metaElem.replace("<meta ", "").replace(" />", "").split(" ").map(item => item.split("=").map(item => item.replaceAll("\"", "")))
  const metaProps = Object.fromEntries(propsList)
  
  return (
    <>
      <Head>
        <title>{data.meta_title}</title>
        <meta name="description" content={data.meta_description} />
        <link rel="canonical" href={`https://www.${DOMAIN}/contact-us`} />

        {Object.entries(data?.schemas).map(([id, schema]) => {
          return (
            <script
              key={id}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema)
                  .replaceAll("[current_url]", `${DOMAIN}/contact-us`)
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
      <PageGenerator
        data={data}
        breadcrumbs={breadcrumbs}
        type="contact-us"
        DOMAIN={DOMAIN}
        images={images}
      />
    </>
  );
}

export const getServerSideProps = async ({req}) => {
  const domain = getDomainFromReqHeader(req.headers);
  const images = await getImagesOfDomain(domain);
  const { data } = await axios(
    `${process.env.API_URL}/api/site?${new URLSearchParams({
      domain: domain,
      type: "contact"
    }).toString()}`
  );
  const breadcrumbs = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Contact",
      href: `/contact-us`,
    },
  ];

  return {
    props: {
      data,
      DOMAIN: domain,
      breadcrumbs,
      images
    },
  };
};
