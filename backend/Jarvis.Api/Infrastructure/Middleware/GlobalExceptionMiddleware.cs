using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace Jarvis.Api.Infrastructure.Middleware;

public sealed class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception while processing request {Method} {Path}", context.Request.Method, context.Request.Path);

            var details = new ProblemDetails
            {
                Title = "Unexpected server error",
                Detail = "Jarvis encountered an unexpected error while processing your request.",
                Status = (int)HttpStatusCode.InternalServerError,
                Instance = context.Request.Path
            };

            context.Response.StatusCode = details.Status.Value;
            await context.Response.WriteAsJsonAsync(details);
        }
    }
}
