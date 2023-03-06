import fs from "fs";
const e = () => <></>;
export default e;
export const getServerSideProps = async ({ req, res }) => {
  try {
    const domain = req.headers["x-forwarded-host"].indexOf("amplifyapp.com") > 0 ? "riversidetowing.us" : req.headers["x-forwarded-host"].replace("https://", "").replace("http://", "").replace("www.", "");

    const robots = fs.readFileSync(
      `${process.cwd()}/public/${domain}/robots.txt`
    );

    res.setHeader("Content-Type", "text/plain");
    res.write(robots);
    res.end();

    return {
      props: {},
    };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
};
