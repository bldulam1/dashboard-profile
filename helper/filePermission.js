const file =
  "V:/JP01/DataLake/Common_Write/ClarityResources/Installers/test.txt";

const fs = require("fs");

// console.log(ret);
// function getPermission(file) {
//   return fs.accessSync(file, fs.constants.W_OK);
// }

// try {
//   const file =
//     "V:/JP01/DataLake/Common_Write/ClarityResources/Installers/test.txt";
//   fs.accessSync(file, fs.constants.W_OK);
//   const permission = getPermission(file);
//   console.log("can write %s", file);
// } catch (err) {
//   console.log("%s doesn't exist", file);
// }

// console.log(permission);
// fs.chmod(file, 055, err => {
//   err && console.error(err);
//   fs.accessSync(file, fs.constants.W_OK);
// });

const f = "V:/JP01/DataLake/Common_Write/ClarityResources/Installers/test.txt";
const hondaFileR =
  "V:/JP01/DataLake/Valpro/Honda/01_Honda_JYT_CRV_red_NB2.0/01_Smoke_Test/20181031_SmokeTest_NB20_cfg325_HondaCRVred_Testdrive 1h/REC_30Oct2018_21-44-32_TIMED_3010803000.cvw";
const hondaFileW =
  "V:/JP01/DataLake/Valpro/Honda/01_Honda_JYT_CRV_red_NB2.0/01_Smoke_Test/[DATE]_[Project]_[Vehicle]_[SW]_[Testname].txt";

const files = [f];

async function canWrite(path) {
  return new Promise(resolve => {
    try {
      fs.access(path, fs.W_OK, err => {
        resolve(true);
      });
    } catch (error) {
      resolve(false);
    }
  });
}

async function main() {
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    // fs.chmod(file, 0555, err => {
    //   err && console.error(err);
    //   fs.accessSync(file, fs.constants.W_OK);
    // });

    console.log(await canWrite(file), file);
  }
}

main();

Get-ItemProperty -Path "V:/JP01/DataLake/Common_Write/ClarityResources/Installers/" | Select-Object IsReadOnly
Set-ItemProperty -Path "V:/JP01/DataLake/Common_Write/ClarityResources/Installers/" -Name IsReadOnly -Value true
