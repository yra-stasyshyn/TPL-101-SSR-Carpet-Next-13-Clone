export const getDomainFromReqHeader = (reqHeader) => {
  try {
    const host = reqHeader["x-forwarded-host"] || reqHeader["host"];
    return (host.includes("amplifyapp.com") || host.includes("localhost") || host.includes("ngrok.io")) ? "temeculacarpetcleaning.us"
      : host.replace("https://", "").replace("http://", "").replace("www.", "");
  }
  catch (e) {
    console.log(e);
  }
};