using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PortfolioFunctions.Clients.Projects;
using PortfolioFunctions.Clients.Experience;
using PortfolioFunctions.Utility;

namespace PortfolioFunctions
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults()
                .ConfigureServices(services =>
                {
                    services.AddSingleton<ClientPrincipalForwardingContext>();
                    services.AddTransient<ForwardClientPrincipalHeaderHandler>();

                    services.AddHttpClient<ProjectsServiceClient>(client =>
                    {
                        var baseUrl = Environment.GetEnvironmentVariable("ProjectsServiceBaseUrl")
                            ?? "http://localhost:7072/api/";
                        client.BaseAddress = new Uri(baseUrl);
                    }).AddHttpMessageHandler<ForwardClientPrincipalHeaderHandler>();

                    services.AddHttpClient<ExperienceServiceClient>(client =>
                    {
                        var baseUrl = Environment.GetEnvironmentVariable("ExperienceServiceBaseUrl")
                            ?? "http://localhost:7073/api/";
                        client.BaseAddress = new Uri(baseUrl);
                    }).AddHttpMessageHandler<ForwardClientPrincipalHeaderHandler>();

                    
                })
                .Build();

            host.Run();
        }
    }
}
