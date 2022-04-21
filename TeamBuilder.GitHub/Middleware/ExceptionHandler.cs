using Newtonsoft.Json;

namespace TeamBuilder.GitHub.Middleware;

public class ExceptionHandler
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandler> _logger;

    public ExceptionHandler(RequestDelegate next, ILogger<ExceptionHandler> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(httpContext, ex);
        }
    }
    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var err = new ErrorResponse
        {
            Message = RecurseExceptionMessage(exception),
            StackTrace = exception.StackTrace
        };

        var json = JsonConvert.SerializeObject(err);

        await context.Response.WriteAsync(json);
    }

    private static string RecurseExceptionMessage(Exception exception, string message = "")
    {
        message += exception.Message;

        if (string.IsNullOrEmpty(exception?.InnerException?.Message))
            return message;

        message += Environment.NewLine;

        return RecurseExceptionMessage(exception.InnerException, message);
    }
}

public class ErrorResponse
{
    public string Message { get; set; }
    public string StackTrace { get; set; }
}