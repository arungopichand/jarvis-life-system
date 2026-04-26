using Jarvis.Api.Data;
using Jarvis.Api.Application.Services;
using Jarvis.Api.Infrastructure.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularLocalhost", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.Configure<AppTimeOptions>(builder.Configuration.GetSection(AppTimeOptions.SectionName));
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<IAppTimeService, AppTimeService>();
builder.Services.AddScoped<LifeOsInsightsService>();
builder.Services.AddScoped<LearningLogService>();
builder.Services.AddScoped<CommunicationLogService>();
builder.Services.AddScoped<DailyGuideService>();
builder.Services.AddScoped<DailyProgressService>();
builder.Services.AddScoped<IncomeService>();
builder.Services.AddScoped<DiaryService>();
builder.Services.AddScoped<BlogDraftService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseAuthorization();

app.UseCors("AngularLocalhost");

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>()
        .CreateLogger("DatabaseInitializer");

    await DatabaseInitializer.InitializeAsync(dbContext, logger);
}

app.Run();
