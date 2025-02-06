#!/bin/bash
echo "Installing .NET SDK..."
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --version 7.0.100  # Adjust version as needed
export PATH="$PATH:$HOME/.dotnet"
echo "Building the project..."
dotnet publish -c Release -o out