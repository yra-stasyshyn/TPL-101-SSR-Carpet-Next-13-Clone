import axios from "axios";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { getImagesOfDomain } from "../helpers/getImagesOfDomain";

const MyDocument = (props = {}) => {
  const { faviconImage, DOMAIN } = props;
  // const images = JSON.parse(
  //   fs.readFileSync(`${process.cwd()}/json/images.json`, { encoding: "utf-8" })
  // );
  // const faviconImage = images.find((image) => image.tagName === "favicon-32");
  // const DOMAIN = process.env.BASE_UR;
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#97040c" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href={`${DOMAIN}/manifest.json`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${process.env.IMAGE_PATH}${DOMAIN}/${faviconImage?.imageName}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${process.env.IMAGE_PATH}${DOMAIN}/${faviconImage?.imageName}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${process.env.IMAGE_PATH}${DOMAIN}/${faviconImage?.imageName}`}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
MyDocument.getInitialProps = async (ctx) => {
  const initialProps = await Document.getInitialProps(ctx);
  const { req } = ctx;

  if (!process.browser) {
    const DOMAIN = 'temeculacarpetcleaning.us';
    if (!DOMAIN) {
      return initialProps;
    }
    const images = await getImagesOfDomain(DOMAIN);
    const faviconImage = images.find((image) => image.tagName === 'favicon-32');

    return { ...initialProps, faviconImage, DOMAIN };
  }

  return initialProps;
};

export default MyDocument;