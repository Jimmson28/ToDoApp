using Microsoft.EntityFrameworkCore;
using ToDoListAPI.Models;

namespace ToDoListAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Ta właściwość reprezentuje tabelę w bazie danych
        public DbSet<TodoTask> TodoTasks { get; set; }
    }
}