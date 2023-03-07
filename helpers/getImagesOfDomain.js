import axios from "axios";

export const getImagesOfDomain = async (domain) => {
  try {
    const response = await axios(`${process.env.API_URL}/api/template-images/domain?domain=${domain}`);
    if (response) {
      return response.data;
    }
  }
  catch (e) {
    console.log("getImagesOfDomain Error: ", e);
  }
};