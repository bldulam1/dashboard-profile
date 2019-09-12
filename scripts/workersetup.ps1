Stop-Process -ProcessName node;
git clone http://bldulam1:tha3nohk!@de01-gitlab01.corp.int/clarity/clarity2.0.git;
Set-Location ~/clarity2.0/worker;
npm config set proxy http://10.1.9.51:80;
npm i;
npm run prod;

$start = 1
$end = 40
for ($ic = $start; $ic -le $end; $ic++) {
  $username = "s-corp.clarity";
  $password = "7%u0LeCZ";

  If ($ic -le 9) {
    $computername = "jp01-convert0$ic";
  } else {
    $computername = "jp01-convert$ic";
  }

  $passwordsec = ConvertTo-SecureString $password -AsPlainText -Force;
  $cred = New-Object System.Management.Automation.PSCredential ($username, $passwordsec);
  $s = New-PSSession -ComputerName $computername -Credential $cred;

  If($except -contains $ic ){
    Write-Host skip $computername
  } else {
    Write-Host run $computername
    Invoke-Command -Session $s -ScriptBlock {
      Set-Location ~/clarity2.0
      git reset --hard
      git pull origin
    }
  }
}

$generic = @(
  # "jp01-of-wd8901",
  # "jp01-of-wd8902",
  # "jp01-of-wd8903",
  # "jp01-of-wd8904",
  # "jp01-of-wd8905",
  "jp01-hil01",
  "jp01-hil02",
  "jp01-hil03",
  "jp01-hil04",
  "jp01-hil05",
  "jp01-valpro01",
  "jp01-valpro02",
  "jp01-valpro03",
  "jp01-valpro04",
  "jp01-valpro05"
)

foreach ($computername in $generic) {
  $username = "g-jp01.hil01";
  $password = "tha3nohk!";
  $passwordsec = ConvertTo-SecureString $password -AsPlainText -Force;
  $cred = New-Object System.Management.Automation.PSCredential ($username, $passwordsec);
  $s = New-PSSession -ComputerName $computername -Credential $cred;

  Invoke-Command -Session $s -ScriptBlock {
    Write-Host run $computername
  }
}