using Jarvis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Mission> Missions => Set<Mission>();

    public DbSet<Expense> Expenses => Set<Expense>();
}
