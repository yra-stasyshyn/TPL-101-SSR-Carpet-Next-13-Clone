export const getDomainFromReqHeader = (reqHeader) => {
  const host = reqHeader["x-forwarded-host"] || reqHeader["host"];
  return host.includes("amplifyapp.com") || host.includes("localhost") ? "temeculacarpetcleaning.us"
    : host.replace("https://", "").replace("http://", "").replace("www.", "");
};