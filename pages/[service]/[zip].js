/* eslint-disable @next/next/no-page-custom-font */
import axios from "axios";
import Head from "next/head";
import PageGenerator from "../../generator/PageGenerator";
import { getDomainFromReqHeader } from "../../helpers/getDomainFromReqHeader";
import { getImagesOfDomain } from "../../helpers/getImagesOfDomain";

const Page = ({ data, params, breadcrumbs, DOMAIN, images }) => {

  // GOOGLE SEARCH CONSOLE
  const metaElem = data.google_search_console;
  const propsList = metaElem.replace("<meta ", "").replace(" />", "").split(" ").map(item => item.split("=").map(item => item.replaceAll("\"", "")));
  const metaProps = Object.fromEntries(propsList);

  return (
    <>
      <Head>
        <title>{data.meta_title}</title>

        <meta name="description" content={data.meta_description} />
        <link rel="canonical" href={`https://www.${DOMAIN}/${params.service}/${params.zip}`} />

        {Object.entries(data.schemas).map(([id, schema]) => {
          return (
            <script
              key={id}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema)
                  .replaceAll("[current_url]", `${DOMAIN}/blog/${params.id}`)
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
        params={params}
        breadcrumbs={breadcrumbs}
        type="zip"
        images={images}
        DOMAIN={DOMAIN}
      />
      ;
    </>
  );
};

export const getServerSideProps = async ({ req, params }) => {
  const { service, zip } = params;
  const domain = getDomainFromReqHeader(req.headers);
  const images = await getImagesOfDomain(domain);

  if (/[A-Z]/.test("abc")) {
    return {
      notFound: true,
    };
  }

  const { data: homeData } = await axios(
    `${process.env.API_URL}/api/site?${new URLSearchParams({
      domain: domain,
    }).toString()}`
  );

  if (!service.endsWith(homeData.last_url_path)) {
    return {
      redirect: {
        destination: `/${service}-${homeData.last_url_path}/${zip}`,
        permanent: false,
        params
      },
    };
  }

  const zipSplit = zip.split("-");

  if (zipSplit.length > 1) {
    return {
      redirect: {
        destination: `/${service}/${zipSplit[0]}`,
        permanent: false,
        params
      },
    };
  }

  console.log("service: ", service);

  const isDefault = new RegExp(`^${homeData.default_service}-${homeData.last_url_path}`, "i").test(service);

  let breadcrumbs;

  if (isDefault) {
    breadcrumbs = [
      {
        name: "Home",
        href: "/",
      },
      {
        name: zip,
        href: `/${service}/${zip}`,
      },
    ];
  } else {
    breadcrumbs = [
      {
        name: "Home",
        href: "/",
      },
      {
        name: service
          .replace(`-${homeData.last_url_path}`, "")
          .split("-")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" "),
        href: `/${service}`,
      },
      {
        name: zip,
        href: `/${service}/${zip}`,
      },
    ];
  }

  const { data } = await axios(
    `${process.env.API_URL}/api/site?${new URLSearchParams({
      domain: domain,
      type: "zip",
      zip,
      service: service.replace(`-${homeData.last_url_path}`, ""),
    }).toString()}`
  );
  const xxx = service.replace(`-${homeData.last_url_path}`, "");
  console.log("🚀 ~ file: [zip].js:140 ~ getServerSideProps ~ zip:", zip);
  console.log("🚀 ~ file: [zip].js:145 ~ getServerSideProps ~ xxx:", xxx);
  console.log("🚀 ~ file: [zip].js:136 ~ getServerSideProps ~ data:", data);

  if (!data || !!data.response) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: {
        ...data,
        zip_list: homeData.zip_list,
        service_list: homeData.service_list,
        last_url_path: homeData.last_url_path
      },
      params,
      breadcrumbs,
      DOMAIN: domain,
      images
    },
  };
};

export default Page;
