using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Data;

public static class DatabaseInitializer
{
    private static readonly string[] ExpectedTables = ["Missions", "Expenses", "DailyLogs"];

    public static async Task InitializeAsync(AppDbContext dbContext, ILogger logger)
    {
        var databaseCreated = await dbContext.Database.EnsureCreatedAsync();

        if (databaseCreated)
        {
            logger.LogInformation("Database created with the latest MVP schema.");
            return;
        }

        var hasAllExpectedTables = await HasAllExpectedTablesAsync(dbContext);

        if (hasAllExpectedTables)
        {
            return;
        }

        logger.LogWarning(
            "Database schema is missing required tables. Recreating the local MVP database."
        );

        await dbContext.Database.EnsureDeletedAsync();
        await dbContext.Database.EnsureCreatedAsync();
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
}
