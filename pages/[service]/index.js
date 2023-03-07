/* eslint-disable @next/next/no-page-custom-font */
import axios from "axios";
import Head from "next/head";
import PageGenerator from "../../generator/PageGenerator";
import { getDomainFromReqHeader } from "../../helpers/getDomainFromReqHeader";
import { getImagesOfDomain } from "../../helpers/getImagesOfDomain";

const Page = ({ data, params, breadcrumbs, DOMAIN, images }) => {

  // GOOGLE SEARCH CONSOLE
  const metaElem = data.google_search_console
  const propsList = metaElem.replace("<meta ", "").replace(" />", "").split(" ").map(item => item.split("=").map(item => item.replaceAll("\"", "")))
  const metaProps = Object.fromEntries(propsList)

  return (
    <>
      <Head>
        <title>{data.meta_title}</title>

        <meta name="description" content={data.meta_description} />
        <link rel="canonical" href={`https://www.${DOMAIN}/${params.service}`} />

        {Object.entries(data?.schemas).map(([id, schema]) => {
          return (
            <script
              key={id}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema)
                  .replaceAll("[current_url]", `${DOMAIN}/${params.service}`)
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
        type="service"
        images={images}
        DOMAIN={DOMAIN}
      />
    </>
  );
};

export const getServerSideProps = async ({ req, res, params }) => {
  const { service } = params;
  const domain = getDomainFromReqHeader(req.headers);
  const images = await getImagesOfDomain(domain);

  const { data: homeData } = await axios(
    `${process.env.API_URL}/api/site?${new URLSearchParams({
      domain: domain,
    }).toString()}`
  );

  const serviceSplit = service.split("-")

  if (
    serviceSplit.length > 1 &&
    serviceSplit[0].toLowerCase() === homeData.default_service.toLowerCase() &&
    /^\d+$/.test(serviceSplit[1])
  ) {
    return {
      redirect: {
        destination: `/${serviceSplit[0]}-${homeData.last_url_path}/${serviceSplit[1]}`,
        permanent: true,
        params
      },
    }
  }

  if (!service.endsWith(homeData.last_url_path)) {
    return {
      redirect: {
        destination: `/${service}-${homeData.last_url_path}`,
        permanent: true,
        params
      },
    }
  }

  if (new RegExp(`^${homeData.default_service}-${homeData.last_url_path}`, "i").test(service)) {
    return {
      redirect: {
        destination: "/",
      },
    }
  }

  const breadcrumbs = [
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
  ];

  if (
    service.toLowerCase() === homeData.default_service
  ) {
    res.setHeader("Location", "/");
    res.statusCode = 302;
    res.end();
    return {
      props: {},
    };
  }

  const { data } = await axios(
    `${process.env.API_URL}/api/site?${new URLSearchParams({
      domain: domain,
      type: "service",
      service: service.replace(`-${homeData.last_url_path}`, ""),
    }).toString()}`
  );

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
      },
      params,
      breadcrumbs,
      DOMAIN: domain,
      images
    },
  };
};

export default Page;
