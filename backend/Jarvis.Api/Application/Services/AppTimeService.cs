using Microsoft.Extensions.Options;

namespace Jarvis.Api.Application.Services;

public class AppTimeService : IAppTimeService
{
    private readonly TimeProvider _timeProvider;
    private readonly TimeZoneInfo _timeZone;

    public AppTimeService(TimeProvider timeProvider, IOptions<AppTimeOptions> options)
    {
        _timeProvider = timeProvider;
        _timeZone = ResolveTimeZone(options.Value.TimeZoneId);
    }

    public DateTime GetTodayLocalDate()
    {
        var localNow = GetLocalNow();
        return localNow.Date;
    }

    public DateTime GetStartOfTodayLocal()
    {
        return GetTodayLocalDate();
    }

    public DateTime GetStartOfTomorrowLocal()
    {
        return GetStartOfTodayLocal().AddDays(1);
    }

    private DateTime GetLocalNow()
    {
        var utcNow = _timeProvider.GetUtcNow();
        return TimeZoneInfo.ConvertTime(utcNow, _timeZone).DateTime;
    }

    private static TimeZoneInfo ResolveTimeZone(string configuredTimeZoneId)
    {
        var candidateIds = new[]
        {
            configuredTimeZoneId,
            "America/New_York",
            "Eastern Standard Time",
            TimeZoneInfo.Local.Id
        }.Where(id => !string.IsNullOrWhiteSpace(id)).Distinct(StringComparer.OrdinalIgnoreCase);

        foreach (var candidateId in candidateIds)
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById(candidateId);
            }
            catch (TimeZoneNotFoundException)
            {
                // Continue fallback search.
            }
            catch (InvalidTimeZoneException)
            {
                // Continue fallback search.
            }
        }

        return TimeZoneInfo.Local;
    }
}
