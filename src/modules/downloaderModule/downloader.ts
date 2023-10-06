import axios from "axios";
import { load } from "cheerio";
import decompress from "decompress";
import Relationship from "../../models/relationship";
import { createRecomendations } from "../aprioriModule/apriori";
import RelationshipsController from "../../controllers/relationships.controller";
import UpdatesController from "../../controllers/updates.controller";

const BASE_URL = "https://dados.cvm.gov.br";

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

async function getZIP() {
  const hrefZIP = await findMostRecentZipHref();
  const filename = hrefZIP.split("/").splice(-1)[0];

  const strLastSaved = await UpdatesController.getMostRecentUpdate();

  if (filename === strLastSaved) {
    return null;
  }

  const res = await axios.get(hrefZIP, { responseType: "arraybuffer" });
  return { data: res.data, filename };
}

async function insertIntoDB(buffer: Buffer) {
  const N_CNPJ = 1;
  const N_DENOM = 2;
  const N_TYPE = 4;
  const N_ASSET = 16;
  const N_COMPANY = 17;
  const STR_STOCKS = "Ações";

  const data = buffer.toString("latin1").split(/\r?\n/);

  const pairs: Relationship[] = [];
  data.forEach((entry) => {
    const entryData = entry.split(";");
    const cnpj = entryData[N_CNPJ];
    const denom = entryData[N_DENOM];
    const type = entryData[N_TYPE];
    const asset = entryData[N_ASSET];
    const company = entryData[N_COMPANY];
    if (type !== STR_STOCKS) {
      return;
    }

    pairs.push({
      fund: cnpj,
      fundPretty: denom,
      stock: asset,
      stockPretty: company,
    });
  });
  await RelationshipsController.refreshPairs(pairs);
}

export default async function downloadResource() {
  const STR_WANTED_FILE = "cda_fi_BLC_4";

  try {
    const zipFile = await getZIP();
    if (zipFile) {
      const files = await decompress(zipFile.data);
      const fileWanted =
        files.find((file) => {
          return file.path.startsWith(STR_WANTED_FILE);
        }) || files[0];

      await insertIntoDB(fileWanted.data);
      await UpdatesController.insertNewUpdate(zipFile.filename);
      createRecomendations();
    }
  } catch (e) {
    console.log("error", e);
  }
}
