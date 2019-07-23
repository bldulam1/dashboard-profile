const path = require("path");
const fs = require("fs");

const files = [
  {
    input_file: "181214_1510_JP_IMP01_B06_20181129VP1_WI_SY_CR_SS.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\181214_1510_JP_IMP01_B06_20181129VP1_WI_SY_CR_SS"
  },
  {
    input_file: "181105_1836_JP_IMP01_B06_xxx_AN_RN_CR_NT.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\181105_1836_JP_IMP01_B06_xxx_AN_RN_CR_NT"
  },
  {
    input_file: "181105_1914_JP_IMP01_B06_xxx_AN_RN_HWY_NT.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\181105_1914_JP_IMP01_B06_xxx_AN_RN_HWY_NT"
  },
  {
    input_file: "181106_1301_JP_IMP01_B06_xxx_AN_RN_HWY_DY.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\181106_1301_JP_IMP01_B06_xxx_AN_RN_HWY_DY"
  },
  {
    input_file: "181106_1338_JP_IMP01_B06_xxx_AN_RN_CTR_DY.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\181106_1338_JP_IMP01_B06_xxx_AN_RN_CTR_DY"
  },
  {
    input_file: "181106_1427_JP_IMP01_B06_xxx_AN_RN_CR_DY.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\181106_1427_JP_IMP01_B06_xxx_AN_RN_CR_DY"
  },
  {
    input_file: "181107_1337_JP_IMP01_B06_xxx_AN_CY_CTR_DY.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\181107_1337_JP_IMP01_B06_xxx_AN_CY_CTR_DY"
  },
  {
    input_file: "181122_1746_JP_IMP01_B06_xxx_AN_CY_HWY_NT.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\181122_1746_JP_IMP01_B06_xxx_AN_CY_HWY_NT"
  },
  {
    input_file: "190121_1024_JP_IMP01_B06_20190117VP1_WI_SY_CR_DY_N.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\190121_1024_JP_IMP01_B06_20190117VP1_WI_SY_CR_DY_N"
  },
  {
    input_file: "190121_1256_JP_IMP01_B06_20190117VP1_WI_SN_CR_DY_N.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\190121_1256_JP_IMP01_B06_20190117VP1_WI_SN_CR_DY_N"
  },
  {
    input_file: "190121_1359_JP_IMP01_B06_20190117VP1_WI_SN_CR_DY_N.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\190121_1359_JP_IMP01_B06_20190117VP1_WI_SN_CR_DY_N"
  },
  {
    input_file: "190123_1353_JP_IMP01_B06_20190117VP1_WI_SY_CR_DY_N.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterFiles\\190123_1353_JP_IMP01_B06_20190117VP1_WI_SY_CR_DY_N"
  },
  {
    input_file: "190507_1907_RU_IMP01_B3_xxx_SP_CY_CTR_DY_N.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterData\\Russia\\190507_1907_RU_IMP01_B3_xxx_SP_CY_CTR_DY_N"
  },
  {
    input_file: "190507_1943_RU_IMP01_B3_xxx_SP_RN_CTR_SS_N.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterData\\Russia\\190507_1943_RU_IMP01_B3_xxx_SP_RN_CTR_SS_N"
  },
  {
    input_file: "190507_2014_RU_IMP01_B3_xxx_SP_RN_CTR_SS_N.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterData\\Russia\\190507_2014_RU_IMP01_B3_xxx_SP_RN_CTR_SS_N"
  },
  {
    input_file: "190508_1650_RU_IMP01_B3_xxx_SP_CY_HWY_DY_N.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterData\\Russia\\190508_1650_RU_IMP01_B3_xxx_SP_CY_HWY_DY_N"
  },
  {
    input_file: "190508_1751_RU_IMP01_B3_xxx_SP_RN_HWY_DY_N.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterData\\Russia\\190508_1751_RU_IMP01_B3_xxx_SP_RN_HWY_DY_N"
  },
  {
    input_file: "190512_1205_RU_IMP01_B3_xxx_SP_CY_NR_DY_N.idw4",
    output_location:
      "V:\\JP01\\DataLake\\SVS350_DC\\DC_Data\\MasterData\\Russia\\190512_1205_RU_IMP01_B3_xxx_SP_CY_NR_DY_N"
  }
];

const completed = [];
const aborted = [];

files.forEach(file => {
  const { output_location, input_file } = file;
  const outFiles = fs.readdirSync(output_location);
  const adtfPath = path.join(output_location, "Master_ADTF");
  const adtfFiles = fs.existsSync(adtfPath) ? fs.readdirSync(adtfPath) : [];

  const idw4 = outFiles.filter(o_file => o_file.includes(".idw4")).length > 0;
  const adtf = adtfFiles.filter(o_file => o_file.includes(".dat")).length > 0;

  idw4 && adtf
    ? completed.push({ input_file, output_location })
    : aborted.push({ input_file, output_location });
});

console.log("Completed", completed.map(f=> f.input_file));
console.log("Aborted", aborted.map(f=> f.input_file));

completed= [ '181105_1836_JP_IMP01_B06_xxx_AN_RN_CR_NT.idw4',
  '190121_1256_JP_IMP01_B06_20190117VP1_WI_SN_CR_DY_N.idw4',
  '190121_1359_JP_IMP01_B06_20190117VP1_WI_SN_CR_DY_N.idw4',
  '190507_1943_RU_IMP01_B3_xxx_SP_RN_CTR_SS_N.idw4',
  '190507_2014_RU_IMP01_B3_xxx_SP_RN_CTR_SS_N.idw4',
  '190508_1751_RU_IMP01_B3_xxx_SP_RN_HWY_DY_N.idw4',
  '190512_1205_RU_IMP01_B3_xxx_SP_CY_NR_DY_N.idw4' ]
Aborted [ '181214_1510_JP_IMP01_B06_20181129VP1_WI_SY_CR_SS.idw4',
  '181105_1914_JP_IMP01_B06_xxx_AN_RN_HWY_NT.idw4',
  '181106_1301_JP_IMP01_B06_xxx_AN_RN_HWY_DY.idw4',
  '181106_1338_JP_IMP01_B06_xxx_AN_RN_CTR_DY.idw4',
  '181106_1427_JP_IMP01_B06_xxx_AN_RN_CR_DY.idw4',
  '181107_1337_JP_IMP01_B06_xxx_AN_CY_CTR_DY.idw4',
  '181122_1746_JP_IMP01_B06_xxx_AN_CY_HWY_NT.idw4',
  '190121_1024_JP_IMP01_B06_20190117VP1_WI_SY_CR_DY_N.idw4',
  '190123_1353_JP_IMP01_B06_20190117VP1_WI_SY_CR_DY_N.idw4',
  '190507_1907_RU_IMP01_B3_xxx_SP_CY_CTR_DY_N.idw4',
  '190508_1650_RU_IMP01_B3_xxx_SP_CY_HWY_DY_N.idw4' ]


"20190406_111700_FCR_SBR_AD2_R0500D54_JARI_JSOIMPREZA_IST_03_006_L_02.cvw",
"20180830_153600_FCR_SBR_AC0_PreR04_VNBSH_JSO.OUTBACK_CTB_04_002_R_03.cvw",
"20190203_104100_FCR_SBR_AD1_R04_VNBSH_JSOIMPREZA_ALC_04_023_L_01.cvw",
"20180830_155000_FCR_SBR_AC0_PreR04_VNBSH_JSO.OUTBACK_CTB_04_002_L_03.cvw",
"20180830_152900_FCR_SBR_AC0_PreR04_VNBSH_JSO.OUTBACK_CTB_04_001_R_03.cvw",
