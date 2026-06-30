using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using PortfolioFunctions.Models;

namespace PortfolioFunctions.Functions
{
    public class ProfessionalProjectFunctions
    {
        private readonly ILogger _logger;
        private readonly Container _container;

        public ProfessionalProjectFunctions(ILoggerFactory loggerFactory, CosmosClient cosmosClient)
        {
            _logger = loggerFactory.CreateLogger<ProfessionalProjectFunctions>();

            var databaseName = Environment.GetEnvironmentVariable("CosmosDbDatabaseName");
            var containerName = Environment.GetEnvironmentVariable("CosmosDbContainerName");
            _container = cosmosClient.GetContainer(databaseName, containerName);
        }

        [Function("GetProfessionalProjects")]
        public async Task<HttpResponseData> GetProfessionalProjects(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "professional-projects")] HttpRequestData req)
        {
            _logger.LogInformation("Retrieving professional projects from Cosmos DB.");

            var projects = new List<ProfessionalProject>();
            var query = new QueryDefinition("SELECT * FROM c");

            using var iterator = _container.GetItemQueryIterator<ProfessionalProject>(query);
            while (iterator.HasMoreResults)
            {
                var page = await iterator.ReadNextAsync();
                projects.AddRange(page);
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(projects);
            return response;
        }

        [Function("GetProfessionalProjectById")]
        public async Task<HttpResponseData> GetProfessionalProjectById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "professional-projects/{id}")] HttpRequestData req,
            string id)
        {
            _logger.LogInformation("Retrieving a professional project by id from Cosmos DB.");

            try
            {
                var response = await _container.ReadItemAsync<ProfessionalProject>(id, new PartitionKey(id));
                var result = req.CreateResponse(HttpStatusCode.OK);
                await result.WriteAsJsonAsync(response.Resource);
                return result;
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                await notFound.WriteStringAsync($"Project with id '{id}' not found.");
                return notFound;
            }
        }

        [Function("AddProfessionalProject")]
        public async Task<HttpResponseData> AddProfessionalProject(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "professional-projects")] HttpRequestData req)
        {
            _logger.LogInformation("Adding a professional project to Cosmos DB.");

            var project = await req.ReadFromJsonAsync<ProfessionalProject>();
            if (project == null || string.IsNullOrWhiteSpace(project.Name))
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("A project with at least a 'name' is required.");
                return badRequest;
            }

            if (string.IsNullOrWhiteSpace(project.Id))
            {
                project.Id = Guid.NewGuid().ToString();
            }

            var created = await _container.CreateItemAsync(
                project,
                new PartitionKey(project.Id));

            var response = req.CreateResponse(HttpStatusCode.Created);
            await response.WriteAsJsonAsync(created.Resource);
            return response;
        }

        [Function("UpdateProfessionalProject")]
        public async Task<HttpResponseData> UpdateProfessionalProject(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "professional-projects/{id}")] HttpRequestData req,
            string id)
        {
            _logger.LogInformation("Updating a professional project in Cosmos DB.");

            var updatedProject = await req.ReadFromJsonAsync<ProfessionalProject>();
            if (updatedProject == null || string.IsNullOrWhiteSpace(updatedProject.Name))
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("A project with at least a 'name' is required.");
                return badRequest;
            }

            updatedProject.Id = id;

            try
            {
                var response = await _container.ReplaceItemAsync(
                    updatedProject,
                    id,
                    new PartitionKey(id));

                var result = req.CreateResponse(HttpStatusCode.OK);
                await result.WriteAsJsonAsync(response.Resource);
                return result;
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                await notFound.WriteStringAsync($"Project with id '{id}' not found.");
                return notFound;
            }
        }

        [Function("DeleteProfessionalProject")]
        public async Task<HttpResponseData> DeleteProfessionalProject(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "professional-projects/{id}")] HttpRequestData req,
            string id)
        {
            _logger.LogInformation("Deleting a professional project from Cosmos DB.");

            try
            {
                var response = await _container.DeleteItemAsync<ProfessionalProject>(id, new PartitionKey(id));
                var result = req.CreateResponse(HttpStatusCode.NoContent);
                return result;
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                await notFound.WriteStringAsync($"Project with id '{id}' not found.");
                return notFound;
            }
        }
    }
}
