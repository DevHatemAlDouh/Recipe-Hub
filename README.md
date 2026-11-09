<div align="center">

# 🍲 Recipe Hub

**A mobile-first platform for discovering, sharing, and managing recipes**

[![API](https://img.shields.io/badge/API-.NET%208-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20Native-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![Database](https://img.shields.io/badge/Database-SQL%20Server-CC2927?style=flat-square&logo=microsoftsqlserver)](https://www.microsoft.com/sql-server)
[![Language](https://img.shields.io/badge/Language-C%23%20%7C%20JavaScript-239120?style=flat-square&logo=csharp)](https://learn.microsoft.com/dotnet/csharp/)

---

</div>

## 📖 Overview

**Recipe Hub** is a recipe-sharing application with an Expo and React Native client, an ASP.NET Core API, and a separate ASP.NET Core dashboard. Users can browse and search recipes, view ingredients and preparation steps, and interact with recipes and other users.

## ✨ Features

- **🍽️ Recipe discovery:** Browse recipes and explore suggested recipes.
- **🔍 Search and categories:** Find recipes and browse them by category.
- **🧑‍🍳 Recipe management:** Add and edit recipes, ingredients, and preparation steps.
- **⭐ Community interactions:** Rate and comment on recipes, and manage favorites.
- **👤 User profiles:** Sign in, manage profile information, and view personal recipes.
- **🛠️ Management dashboard:** ASP.NET Core MVC dashboard for managing application data.

## 🛠️ Tech Stack

| Layer                     | Technology                                  |
| :------------------------ | :------------------------------------------ |
| **Mobile and web client** | React Native, Expo SDK 52, Expo Router      |
| **API**                   | ASP.NET Core Web API, .NET 8                |
| **Dashboard**             | ASP.NET Core MVC, .NET 8                    |
| **Database**              | Microsoft SQL Server, Entity Framework Core |
| **Languages**             | JavaScript, C#                              |

## 📂 Project Structure

```text
Recipe-Hub/
├── API/
│   ├── API.sln
│   └── API/                 # ASP.NET Core API, data models, and migrations
├── Dashboard/
│   └── Dashboard/           # ASP.NET Core MVC management dashboard
├── frontend/                # Expo and React Native application
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js and npm** for the Expo client.
- **.NET 8 SDK** for the API and dashboard.
- **SQL Server** and a database connection string for the API.
- For mobile development, an Android emulator or device, or an iOS simulator/device.

### Run the API

Set the SQL Server connection string using the `ConnectionStrings__DefaultConnection` environment variable. For example, in PowerShell:

```powershell
$env:ConnectionStrings__DefaultConnection = "<your SQL Server connection string>"
dotnet run --project API/API/API.csproj
```

The API includes Swagger UI for exploring its endpoints. Configure your database and apply the Entity Framework migrations as needed for your environment.

### Run the dashboard

```bash
dotnet run --project Dashboard/Dashboard/Dashboard.csproj
```

### Run the Expo app

```bash
npm ci --prefix frontend
npm start --prefix frontend
```

Use the Expo CLI prompts to open the app on a device, emulator, or simulator. The frontend currently contains API endpoint URLs in its source; update them to point to your API deployment when using a different backend.

> **Configuration note:** Keep database credentials and other secrets in local environment configuration. Do not commit credentials to the repository.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make and test your changes.
4. Commit and push your branch.
5. Open a pull request.

## 👥 Contributors

The project was built collaboratively:

- **Hatem Al-Douh:** Built the API and management dashboard — [GitHub](https://github.com/DevHatemAlDouh)
- **MohammedBQ:** Built the mobile application — [GitHub](https://github.com/MohammedBQ)
- **Mutasem7:** Built the mobile application — [GitHub](https://github.com/Mutasem7)

Repository: [DevHatemAlDouh/Recipe-Hub](https://github.com/DevHatemAlDouh/Recipe-Hub)

## 📝 License

No license file is currently included in this repository.

<!-- {use profolio} -->
