require("dotenv").config();
const fs = require("fs");
const { default: fetch } = require("node-fetch");

const loadStaticData = async () => {
  const domains = process.env.DOMAIN.split(",");
  for (const domain of domains) {
    try {
      fs.rmdirSync(`./public/${domain}`, { recursive: true, force: true });
    } catch (err) {
      console.log("Folder doesn't exist");
    }

    fs.mkdirSync(`./public/${domain}`);
    fs.mkdirSync(`./public/${domain}/json`);

    console.log("Loading static json data...");

    try {
      const homeResponse = await fetch(
        `${process.env.API_URL}/api/site?${new URLSearchParams({
          domain,
          type: "home",
        }).toString()}`
      );

      const homeData = await homeResponse.json();

      fs.writeFile(
        `./public/${domain}/robots.txt`,
        homeData.robots_text,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );

      fs.readFile(
        "./public/main-sitemap.xsl",
        {
          encoding: "utf-8",
        },
        (err, fileContents) => {
          if (err) console.log(err);
          else {
            fs.writeFile(
              `./public/${domain}/sitemap.xsl`,
              fileContents
                .replaceAll(
                  "%DOMAIN%",
                  `${domain.startsWith("https://") ? "" : "https://"}${domain}`
                )
                .replaceAll("%CITY_NAME%", homeData.city),
              (err) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          }
        }
      );

      const bannerImagesResponse = await fetch(
        `${process.env.API_URL
        }/api/template-images/domain?${new URLSearchParams({
          domain,
        }).toString()}`
      );

      const bannerImages = await bannerImagesResponse.json();

      fs.writeFile(
        `./public/${domain}/json/images.json`,
        JSON.stringify(bannerImages),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );

      const manifest = {
        scope: "/",
        start_url: "/",
        display: "standalone",
        theme_color: "#97040c",
        name: "Towing Minneapolis",
        background_color: "#ffffff",
        short_name: "Towing Minneapolis",
        prefer_related_applications: true,
        description: "Minneapolis towing services",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      };

      manifest.name = homeData.contact_form_sub_title;
      manifest.short_name = homeData.contact_form_sub_title;
      manifest.icons[0].src = bannerImages.find((image) => image.tagName === 'favicon-32')?.path;
      manifest.icons[1].src = bannerImages.find((image) => image.tagName === 'favicon-32')?.path;
      fs.writeFile(
        `./public/${domain}/manifest.json`,
        JSON.stringify(manifest),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );

      // fs.rmdirSync(`./public/${domain}/temp`, { recursive: true, force: true });
    } catch (err) {
      console.log("loadStaticData ~ err", err);
    }
  }
};

loadStaticData();
