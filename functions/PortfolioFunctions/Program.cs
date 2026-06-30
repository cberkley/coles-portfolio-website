using System;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

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
                    services.AddSingleton(_ =>
                    {
                        var connectionString = Environment.GetEnvironmentVariable("CosmosDbConnection");
                        var client = new CosmosClient(connectionString);

                        // Auto-create database and container on first run
                        var databaseName = Environment.GetEnvironmentVariable("CosmosDbDatabaseName");
                        var containerName = Environment.GetEnvironmentVariable("CosmosDbContainerName");
                        var database = client.CreateDatabaseIfNotExistsAsync(databaseName).GetAwaiter().GetResult();
                        database.Database.CreateContainerIfNotExistsAsync(containerName, "/id").GetAwaiter().GetResult();

                        return client;
                    });
                })
                .Build();

            host.Run();
        }
    }
}
