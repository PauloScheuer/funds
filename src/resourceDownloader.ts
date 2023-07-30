import axios from "axios";
import { load } from "cheerio";
import fs from "fs";
import decompress from "decompress";

const BASE_URL = "https://dados.cvm.gov.br";
const STR_FILEPATH = "resources/";

async function findMostRecentPageHref() {
  const STR_PARENT_SELECTOR = "ul.resource-list";
  const STR_ITEM_SELECTOR = ".resource-item";
  const LIST_URL = "/dataset/fi-doc-cda";
  const res = await axios.get(BASE_URL + LIST_URL);

  const $ = load(res.data);
  const htmlParent = $(STR_PARENT_SELECTOR);
  const htmlItems = htmlParent.find(STR_ITEM_SELECTOR);
  const htmlMostRecent = htmlItems.last();

  return (htmlMostRecent.find("a")[0].attribs as any).href;
}

async function findMostRecentZipHref() {
  const STR_RESOURCE_SELECTOR = ".resource-url-analytics";

  const href = await findMostRecentPageHref();
  const res = await axios.get(BASE_URL + href);
  const $ = load(res.data);

  const htmlResource = $(STR_RESOURCE_SELECTOR)[0];
  return (htmlResource.attribs as any).href as string;
}

async function downloadZIP() {
  const hrefZIP = await findMostRecentZipHref();
  const filename = hrefZIP.split("/").splice(-1)[0];
  if (fs.existsSync(STR_FILEPATH + filename)) {
    return "";
  }

  const res = await axios.get(hrefZIP, { responseType: "arraybuffer" });
  if (!fs.existsSync(STR_FILEPATH)) {
    fs.mkdirSync(STR_FILEPATH);
  }
  fs.writeFileSync(STR_FILEPATH + filename, res.data);
  return STR_FILEPATH + filename;
}

export default async function downloadResource() {
  const STR_WANTED_FILE = "cda_fi_BLC_4";
  const STR_LOCAL_FILE = "compositions.csv";
  try {
    const zipPath = await downloadZIP();
    if (zipPath) {
      const files = await decompress(zipPath);
      const fileWanted =
        files.find((file) => {
          return file.path.startsWith(STR_WANTED_FILE);
        }) || files[0];
      fs.writeFileSync(STR_FILEPATH + STR_LOCAL_FILE, fileWanted.data);
    }
  } catch (e) {
    console.log("erro", e);
  }
}
