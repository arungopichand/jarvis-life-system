namespace Jarvis.Api.Application.Services;

public interface IAppTimeService
{
    DateTime GetTodayLocalDate();

    DateTime GetStartOfTodayLocal();

    DateTime GetStartOfTomorrowLocal();
}
