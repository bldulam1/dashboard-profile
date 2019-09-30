$files = @(
  "V:\JP01\DataLake\Valpro\Subaru_77GHz_Ho3_Data\XYG\EWE\ll9zabkzt4-pb0fc-jue81bq1\20190402_105000_FCR_SBR_AD2_R0500D51_JARI_JSOIMPREZA_ALC_22_020_R_01.cvw"
)

foreach ($MeasFilePath in $files) {
  $MeasFile = Get-ChildItem $MeasFilePath
  $MFBaseName = $MeasFile.BaseName;
  $MFChildName = $MeasFile.PSChildName;
  $MFParent = Convert-Path $MeasFile.PSParentPath;
  $OutputDir = "V:\JP01\DataLake\Common_Write\CLARITY_OUPUT\Subaru_77GHz\test\$MFBaseName";
  $location = "V:\JP01\DataLake\Common_Write\ClarityResources\SIMSsuperSLN13p1_bin_averageSpeed";

  $OutputDir

  New-Item -ItemType Directory -Force -Path $OutputDir;
  Set-Location $location;
  ./SIMS_GEN12.exe -MeasDir $MFParent -MeasFile $MFChildName -OutFolder $OutputDir -ECU 12 -RegrTest -ReplayADC -VehicleData AMP -CAN1 1 -CAN2 4 -CanReDir 1 -OutCVW;
}
