using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularLocalhost", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.UseCors("AngularLocalhost");

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    dbContext.Database.EnsureCreated();

    if (!dbContext.Missions.Any())
    {
        var today = DateTime.Today;

        dbContext.Missions.AddRange(
            new Mission
            {
                Title = "Gym",
                Description = "Complete your workout for today.",
                XpReward = 30,
                IsCompleted = false,
                MissionDate = today,
                Category = "Health"
            },
            new Mission
            {
                Title = "English Practice",
                Description = "Practice speaking, reading, or writing in English.",
                XpReward = 20,
                IsCompleted = false,
                MissionDate = today,
                Category = "Learning"
            },
            new Mission
            {
                Title = "Track Expenses",
                Description = "Record today's spending.",
                XpReward = 15,
                IsCompleted = false,
                MissionDate = today,
                Category = "Money"
            },
            new Mission
            {
                Title = "Learn .NET",
                Description = "Spend time learning .NET today.",
                XpReward = 30,
                IsCompleted = false,
                MissionDate = today,
                Category = "Technical Skills"
            },
            new Mission
            {
                Title = "Eat Protein",
                Description = "Make sure one meal today includes protein.",
                XpReward = 20,
                IsCompleted = false,
                MissionDate = today,
                Category = "Health"
            });

        dbContext.SaveChanges();
    }
}

app.Run();
