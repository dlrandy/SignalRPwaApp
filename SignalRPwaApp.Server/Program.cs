
using SignalRPwaApp.Server.Hubs;
using SignalRPwaApp.Server.Services;

namespace SignalRPwaApp.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddSingleton<ChatService>();
            builder.Services.AddSignalR();
            builder.Services.AddCors();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors(cors => cors.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:17752", "https://localhost:17752"));
            app.MapControllers();
            app.MapHub<ChatHub>("/hubs/chat");

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
