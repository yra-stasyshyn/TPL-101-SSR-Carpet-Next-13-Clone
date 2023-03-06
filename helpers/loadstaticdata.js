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
        `${
          process.env.API_URL
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
      // fs.rmdirSync(`./public/${domain}/temp`, { recursive: true, force: true });
    } catch (err) {
      console.log(
        "🚀 ~ file: loadstaticdata.js:49 ~ loadStaticData ~ err",
        err
      );
    }
  }
};

// loadStaticData();
