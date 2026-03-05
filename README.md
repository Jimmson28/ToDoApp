# ToDoList App

Aplikacja do zarządzania zadaniami zbudowana w **ASP.NET Core** (backend) i **Vue 3** (frontend).

## Wymagania

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

## Uruchomienie

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/Jimmson28/ToDoApp.git
cd ToDoListApp
```

### 2. Zainstaluj narzędzie Entity Framework (jeśli nie masz)
```bash
dotnet tool install --global dotnet-ef
```

### 3. Uruchom backend
```bash
dotnet restore
dotnet ef database update
dotnet run
```

Backend działa na `http://localhost:5275`

### 4. Uruchom frontend
```bash
cd todolistfrontend
npm install
npm run dev
```

Frontend działa na `http://localhost:5173`

## Instrukcja obsługi

### Dodawanie zadania
1. Wypełnij pole **Title**, **Start Date** i **Deadline** (wymagane)
2. Opcjonalnie dodaj **Description**
3. Kliknij **Add Task**

### Filtrowanie zadań
- **Active** — zadania niezakończone z aktualnym deadlinem
- **Done** — zadania oznaczone jako wykonane
- **Overdue** — zadania po terminie

### Edycja zadania
Kliknij **Edit Task** przy wybranym zadaniu, zmień dane i kliknij **Save changes**

### Usuwanie zadania
Kliknij **Delete** przy wybranym zadaniu

### Wyszukiwanie po dacie
W panelu **Search for task** wybierz datę i zatwierdź klikając **Search** button — wyświetlą się niezakończone zadania, które były aktywne w wybranym dniu (czyli takie których Start Date jest przed tą datą, a Deadline po niej)

### Powiadomienia
Notification z ostrzeżeniem pojawia się automatycznie gdy istnieje task lub taski,
które mają deadline do konca następnego dnia