using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PortfolioFunctions.Clients.Projects;
using PortfolioFunctions.Clients.Experience;
using PortfolioFunctions.Utility;
using Microsoft.Azure.Functions.Worker;
using System.Text.Json;
using System.Text.Json.Serialization;
using Azure.Core.Serialization;

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

                    services.Configure<WorkerOptions>(options =>
                    {
                        options.Serializer = new JsonObjectSerializer(new JsonSerializerOptions
                        {
                            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
                            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
                        });
                    });
                })
                .Build();

            host.Run();
        }
    }
}
