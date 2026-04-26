using Jarvis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Data;

public static class DatabaseInitializer
{
    private static readonly string[] ExpectedTables =
    [
        "Missions",
        "MissionTemplates",
        "Expenses",
        "DailyLogs",
        "UserSettings",
        "LearningLogs",
        "CommunicationLogs",
        "LearningTopicProgresses",
        "VocabularyEntries",
        "IncomeLogs",
        "DiaryEntries",
        "BlogDrafts"
    ];

    public static async Task InitializeAsync(AppDbContext dbContext, ILogger logger)
    {
        var databaseCreated = await dbContext.Database.EnsureCreatedAsync();

        if (databaseCreated)
        {
            await SeedMissionTemplatesAsync(dbContext);
            logger.LogInformation("Database created with the latest MVP schema.");
            return;
        }

        var hasAllExpectedTables = await HasAllExpectedTablesAsync(dbContext);

        if (hasAllExpectedTables)
        {
            await SeedMissionTemplatesAsync(dbContext);
            return;
        }

        logger.LogWarning(
            "Database schema is missing required tables. Recreating the local MVP database."
        );

        await dbContext.Database.EnsureDeletedAsync();
        await dbContext.Database.EnsureCreatedAsync();
        await SeedMissionTemplatesAsync(dbContext);
    }

    private static async Task<bool> HasAllExpectedTablesAsync(AppDbContext dbContext)
    {
        var connection = dbContext.Database.GetDbConnection();
        var shouldCloseConnection = connection.State != System.Data.ConnectionState.Open;

        if (shouldCloseConnection)
        {
            await connection.OpenAsync();
        }

        try
        {
            foreach (var tableName in ExpectedTables)
            {
                using var command = connection.CreateCommand();
                command.CommandText = """
                    SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.TABLES
                    WHERE TABLE_NAME = @tableName
                    """;

                var parameter = command.CreateParameter();
                parameter.ParameterName = "@tableName";
                parameter.Value = tableName;
                command.Parameters.Add(parameter);

                var result = await command.ExecuteScalarAsync();
                var tableCount = Convert.ToInt32(result);

                if (tableCount == 0)
                {
                    return false;
                }
            }

            return true;
        }
        finally
        {
            if (shouldCloseConnection)
            {
                await connection.CloseAsync();
            }
        }
    }

    private static async Task SeedMissionTemplatesAsync(AppDbContext dbContext)
    {
        var hasTemplates = await dbContext.MissionTemplates.AnyAsync();

        if (hasTemplates)
        {
            return;
        }

        dbContext.MissionTemplates.AddRange(
            new MissionTemplate
            {
                Title = "Gym",
                Description = "Complete your workout for today.",
                XpReward = 30,
                Category = "Health",
                IsEnabled = true
            },
            new MissionTemplate
            {
                Title = "English Practice",
                Description = "Practice speaking, reading, or writing in English.",
                XpReward = 20,
                Category = "Communication",
                IsEnabled = true
            },
            new MissionTemplate
            {
                Title = "Track Expenses",
                Description = "Record today's spending.",
                XpReward = 15,
                Category = "Finance",
                IsEnabled = true
            },
            new MissionTemplate
            {
                Title = "Learn .NET",
                Description = "Spend time learning .NET today.",
                XpReward = 30,
                Category = "Skill",
                IsEnabled = true
            },
            new MissionTemplate
            {
                Title = "Eat Protein",
                Description = "Make sure one meal today includes protein.",
                XpReward = 20,
                Category = "Health",
                IsEnabled = true
            }
        );

        await dbContext.SaveChangesAsync();
    }
}
