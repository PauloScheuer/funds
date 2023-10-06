"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const fs_1 = __importDefault(require("fs"));
const decompress_1 = __importDefault(require("decompress"));
const apriori_1 = require("../aprioriModule/apriori");
const relationships_controller_1 = __importDefault(require("../../controllers/relationships.controller"));
const BASE_URL = "https://dados.cvm.gov.br";
const STR_FILEPATH = "resources/";
function findMostRecentPageHref() {
    return __awaiter(this, void 0, void 0, function* () {
        const STR_PARENT_SELECTOR = "ul.resource-list";
        const STR_ITEM_SELECTOR = ".resource-item";
        const LIST_URL = "/dataset/fi-doc-cda";
        const res = yield axios_1.default.get(BASE_URL + LIST_URL);
        const $ = (0, cheerio_1.load)(res.data);
        const htmlParent = $(STR_PARENT_SELECTOR);
        const htmlItems = htmlParent.find(STR_ITEM_SELECTOR);
        const htmlMostRecent = htmlItems.last();
        return htmlMostRecent.find("a")[0].attribs.href;
    });
}
function findMostRecentZipHref() {
    return __awaiter(this, void 0, void 0, function* () {
        const STR_RESOURCE_SELECTOR = ".resource-url-analytics";
        const href = yield findMostRecentPageHref();
        const res = yield axios_1.default.get(BASE_URL + href);
        const $ = (0, cheerio_1.load)(res.data);
        const htmlResource = $(STR_RESOURCE_SELECTOR)[0];
        return htmlResource.attribs.href;
    });
}
function downloadZIP() {
    return __awaiter(this, void 0, void 0, function* () {
        const hrefZIP = yield findMostRecentZipHref();
        const filename = hrefZIP.split("/").splice(-1)[0];
        if (fs_1.default.existsSync(STR_FILEPATH + filename)) {
            return "";
        }
        const res = yield axios_1.default.get(hrefZIP, { responseType: "arraybuffer" });
        if (!fs_1.default.existsSync(STR_FILEPATH)) {
            fs_1.default.mkdirSync(STR_FILEPATH);
        }
        fs_1.default.writeFileSync(STR_FILEPATH + filename, res.data);
        return STR_FILEPATH + filename;
    });
}
function insertIntoDB(strPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const N_CNPJ = 1;
        const N_DENOM = 2;
        const N_TYPE = 4;
        const N_ASSET = 16;
        const N_COMPANY = 17;
        const STR_STOCKS = "Ações";
        const data = fs_1.default.readFileSync(strPath, { encoding: "latin1" }).split(/\r?\n/);
        const pairs = [];
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
        yield relationships_controller_1.default.refreshPairs(pairs);
    });
}
function downloadResource() {
    return __awaiter(this, void 0, void 0, function* () {
        const STR_WANTED_FILE = "cda_fi_BLC_4";
        const STR_LOCAL_FILE = "compositions.csv";
        try {
            const zipPath = yield downloadZIP();
            if (zipPath) {
                const files = yield (0, decompress_1.default)(zipPath);
                const fileWanted = files.find((file) => {
                    return file.path.startsWith(STR_WANTED_FILE);
                }) || files[0];
                fs_1.default.writeFileSync(STR_FILEPATH + STR_LOCAL_FILE, fileWanted.data);
                yield insertIntoDB(STR_FILEPATH + STR_LOCAL_FILE);
                (0, apriori_1.createRecomendations)();
            }
        }
        catch (e) {
            console.log("error", e);
        }
    });
}
exports.default = downloadResource;
