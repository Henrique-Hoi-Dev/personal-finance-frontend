# Nome da imagem e container
$ImageName = "personal-finance-frontend"
$ContainerName = "personal-finance-frontend"
$PortOut = 3005
$PortIn = 3005

Write-Host "Atualizando $ImageName ..."

# 1. Parar container antigo (se estiver rodando)
$running = docker ps -q -f "name=$ContainerName"
if ($running) {
    Write-Host "Parando container antigo..."
    docker stop $ContainerName | Out-Null
}

# 2. Remover container antigo (se existir)
$exists = docker ps -aq -f "name=$ContainerName"
if ($exists) {
    Write-Host "Removendo container antigo..."
    docker rm $ContainerName | Out-Null
}

# 3. Rebuild da imagem
Write-Host "Rebuild da imagem $ImageName ..."
docker build -t $ImageName .

# 4. Subir novo container
Write-Host "Iniciando novo container..."
docker run -d -p $PortOut`:$PortIn --name $ContainerName $ImageName | Out-Null

Write-Host "Front atualizado e rodando em http://localhost:$PortOut"
