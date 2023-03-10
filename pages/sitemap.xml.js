import { getSitemaps } from "../sitemap-api";
import { getDomainFromReqHeader } from "../helpers/getDomainFromReqHeader";

const Sitemap = () => {};

export const getServerSideProps = async ({ req, res }) => {
  const baseUrl = getDomainFromReqHeader(req.headers);
  const sitemaps = await getSitemaps(baseUrl);
  console.log("🚀 ~ file: sitemap.xml.js:9 ~ getServerSideProps ~ sitemaps:", sitemaps);
  const sitemapindex = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="/${baseUrl}/sitemap.xsl" ?>
  
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps
    .map(
      (sitemap, index) => `
        <sitemap>
          <loc>
            ${baseUrl.startsWith("https://") 
              ? baseUrl 
              : `https://${
                baseUrl.startsWith("www.") 
                ? baseUrl 
                : `www.${baseUrl}`
              }`
            }/sitemaps/${index + 1}
          </loc>
          <lastmod>${new Date()}</lastmod>
        </sitemap>
      `
    )
    .join("")}
  </sitemapindex>`;

  console.log(sitemapindex)

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemapindex);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
