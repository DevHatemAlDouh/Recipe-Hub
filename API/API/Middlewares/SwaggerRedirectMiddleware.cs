namespace API.Middlewares
{
    public class SwaggerRedirectMiddleware
    {
        private readonly RequestDelegate _next;

        public SwaggerRedirectMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Check if the request path is the root
            if (context.Request.Path == "/")
            {
                // Redirect to the Swagger UI
                context.Response.Redirect("/swagger/index.html");
                return; // Short-circuit the pipeline
            }

            await _next(context); // Call the next middleware in the pipeline
        }
    }
}
