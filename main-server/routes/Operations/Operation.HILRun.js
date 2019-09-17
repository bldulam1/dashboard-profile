const Task = require("../../schemas/task");
const Path = require("path");
const operation = "HIL";

function createScript(props) {
  const {
    hilMasterLocation,
    fileName,
    outputLocation,
    ecuVersion,
    ecu,
    sensor
  } = props;
  let hilParameterContents = `[VALPRO]
DAT_FILE_0='${fileName}'
ECU_DO_PPAR=${ecu.ECU_DO_PPAR}
ECU_DO_NVM=${ecu.ECU_DO_NVM}
ECU_DO_DEFAULT_NVM=false
OUTPUT_FOLDER='${outputLocation}'
USE_SENSOR_10=${sensor.USE_SENSOR_10}
USE_SENSOR_11=${sensor.USE_SENSOR_11}
USE_SENSOR_12=${sensor.USE_SENSOR_12}
USE_SENSOR_30=${sensor.USE_SENSOR_30}
USE_SENSOR_32=${sensor.USE_SENSOR_32}

[DEBUG]
KEEP_FILES=false

[SENSOR_FCR]
ECU_VERSION='A:${ecuVersion} - B:0.0'
#ECU_VERSION='1.31.70.14.2 - A:19/25/00 B:50/02/06'
ECU_OEM_APP='C:/SBR_GEN1_2_SW/R7_31_70D6_1/R7_31_70D6_1.mot'
ECU_OEM_BL='C:/SBR_GEN1_2_SW/R7_31_70D6_1/R7_31_70D6_1.cbt'
ECU_ALV_TO_OEM_BL='C:/Gen12_SW/54051_Dai_Gen5/FBL/R2.6/Daimler_GEN5V2_DAI_FBL_1_31_50D2_6.cbt'
ECU_OEM_TO_ALV_BL='C:/Gen12_SW/54051_Dai_Gen5/FBL/R2.6/Daimler_GEN5V2_ALV_FBL_R255_31_44D24_0.odx'`;

  hilParameterContents = hilParameterContents.replace(
    new RegExp("\\n", "g"),
    "`n"
  );

  const configINI = Path.resolve(
    "C:/HILTools/iniFiles_dontdelete/cfg_local.ini"
  );
  const hilParameter = Path.resolve(
    "C:/HILTools/iniFiles_dontdelete/HILParameter_Gen12.ini"
  );

  return `Set-Content ${hilParameter} "${hilParameterContents}"; Set-Location ${hilMasterLocation}; ./HILMaster.exe "${configINI}" "${hilParameter}" -o "${outputLocation}"`;
}

function createHILTasks(props, files) {
  const requestDate = new Date();
  const { project, requestedBy } = props;

  const promises = files.map(({ fileName, path, size }) => {
    const hilMasterLocation = Path.resolve("C:/HILTools/HILMaster");
    const script = createScript({ hilMasterLocation, ...props, fileName });
    return new Task({
      operation,
      project,
      requestedBy,
      inputFile: fileName,
      inputLocation: path,
      size,
      script,
      requestDate,
      status: {
        text: "Pending",
        value: 0
      }
    });
  });

  return Promise.all(promises);
}

module.exports = {
  createHILTasks
};
