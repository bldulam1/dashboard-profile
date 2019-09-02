Set-Location ~
git clone http://bldulam1:tha3nohk!@de01-gitlab01.corp.int/clarity/clarity2.0.git
Set-Location ./clarity2.0/worker;
npm install;
Set-Location ~/clarity2.0/worker; npm run prod;


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
      git pull origin
    }
  }

}

