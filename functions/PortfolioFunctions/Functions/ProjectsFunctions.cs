using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using PortfolioFunctions.Clients.Projects;
using PortfolioFunctions.Utility;

namespace PortfolioFunctions.Functions
{
    public class ProfessionalProjectFunctions
    {
        private readonly ILogger _logger;
        private readonly ProjectsServiceClient _projectsServiceClient;

        private readonly ClientPrincipalForwardingContext _forwardingContext;

        public ProfessionalProjectFunctions(ILoggerFactory loggerFactory, ProjectsServiceClient projectsServiceClient, ClientPrincipalForwardingContext forwardingContext)
        {
            _logger = loggerFactory.CreateLogger<ProfessionalProjectFunctions>();
            _projectsServiceClient = projectsServiceClient;
            _forwardingContext = forwardingContext;
        }

        [Function("GetProfessionalProjects")]
        [OpenApiOperation(operationId: "GetProfessionalProjects", tags: new[] { "ProfessionalProjects" }, Summary = "Get all professional projects", Visibility = OpenApiVisibilityType.Important)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(List<ProfessionalProject>), Description = "List of professional projects")]
        public async Task<HttpResponseData> GetProfessionalProjects(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "professional-projects")] HttpRequestData req)
        {
            _logger.LogInformation("Retrieving professional projects from the projects service.");

            var projects = await _projectsServiceClient.GetProfessionalProjectsAsync();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(projects);
            return response;
        }

        [Function("GetProfessionalProjectById")]
        [OpenApiOperation(operationId: "GetProfessionalProjectById", tags: new[] { "ProfessionalProjects" }, Summary = "Get a professional project by ID", Visibility = OpenApiVisibilityType.Important)]
        [OpenApiParameter(name: "id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "Project ID")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(ProfessionalProject), Description = "The requested project")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NotFound, Description = "Project not found")]
        public async Task<HttpResponseData> GetProfessionalProjectById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "professional-projects/{id}")] HttpRequestData req,
            string id)
        {
            _logger.LogInformation("Retrieving a professional project by id from the projects service.");

            try
            {
                var project = await _projectsServiceClient.GetProfessionalProjectByIdAsync(id);
                var result = req.CreateResponse(HttpStatusCode.OK);
                await result.WriteAsJsonAsync(project);
                return result;
            }
            catch (ProjectsApiException ex) when (ex.StatusCode == (int)HttpStatusCode.NotFound)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                await notFound.WriteStringAsync($"Project with id '{id}' not found.");
                return notFound;
            }
        }

        [Function("AddProfessionalProject")]
        [OpenApiOperation(operationId: "AddProfessionalProject", tags: new[] { "ProfessionalProjects" }, Summary = "Add a new professional project", Visibility = OpenApiVisibilityType.Important)]
        [OpenApiSecurity("x-ms-client-principal-id", SecuritySchemeType.ApiKey, In = OpenApiSecurityLocationType.Header, Name = "X-MS-CLIENT-PRINCIPAL-ID")]
        [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(ProfessionalProject), Required = true, Description = "The project to create")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.Created, contentType: "application/json", bodyType: typeof(ProfessionalProject), Description = "The created project")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.BadRequest, Description = "Invalid project data")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Unauthorized, Description = "Unauthorized")]
        public async Task<HttpResponseData> AddProfessionalProject(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "professional-projects")] HttpRequestData req)
        {
            if (!AuthHelper.IsAuthenticated(req)) {
                return req.CreateResponse(HttpStatusCode.Unauthorized);
            }

            //we need to forward the client principal ID to the downstream service
            //this is important so that in the future I can also implement a front end 
            // on that service and also use the same authentication and authorization 
            // mechanism
            using var scope = _forwardingContext.ForwardRequestHeader(req);

            _logger.LogInformation("Adding a professional project to the projects service.");

            try
            {
                var newProject = await req.ReadFromJsonAsync<ProfessionalProject>();
                if (newProject == null || string.IsNullOrWhiteSpace(newProject.Name))
                {
                    var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequest.WriteStringAsync("A project with at least a 'name' is required.");
                    return badRequest;
                }

                var createdProject = await _projectsServiceClient.AddProfessionalProjectAsync(newProject);

                var result = req.CreateResponse(HttpStatusCode.Created);
                await result.WriteAsJsonAsync(createdProject);
                return result;
            }
            catch (ProjectsApiException ex) when (ex.StatusCode == (int)HttpStatusCode.BadRequest)
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("Invalid project data.");
                return badRequest;
            }
        }

        [Function("UpdateProfessionalProject")]
        [OpenApiOperation(operationId: "UpdateProfessionalProject", tags: new[] { "ProfessionalProjects" }, Summary = "Update an existing professional project", Visibility = OpenApiVisibilityType.Important)]
        [OpenApiSecurity("x-ms-client-principal-id", SecuritySchemeType.ApiKey, In = OpenApiSecurityLocationType.Header, Name = "X-MS-CLIENT-PRINCIPAL-ID")]
        [OpenApiParameter(name: "id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "Project ID")]
        [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(ProfessionalProject), Required = true, Description = "The updated project data")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(ProfessionalProject), Description = "The updated project")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.BadRequest, Description = "Invalid project data")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NotFound, Description = "Project not found")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Unauthorized, Description = "Unauthorized")]
        public async Task<HttpResponseData> UpdateProfessionalProject(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "professional-projects/{id}")] HttpRequestData req,
            string id)
        {
            if (!AuthHelper.IsAuthenticated(req)) {
                return req.CreateResponse(HttpStatusCode.Unauthorized);
            }

            using var scope = _forwardingContext.ForwardRequestHeader(req);

            _logger.LogInformation("Updating a professional project in the projects service.");

            try
            {
                var updatedProject = await req.ReadFromJsonAsync<ProfessionalProject>();
                if (updatedProject == null || string.IsNullOrWhiteSpace(updatedProject.Name))
                {
                    var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badRequest.WriteStringAsync("A project with at least a 'name' is required.");
                    return badRequest;
                }

                var resultProject = await _projectsServiceClient.UpdateProfessionalProjectAsync(id, updatedProject);

                var result = req.CreateResponse(HttpStatusCode.OK);
                await result.WriteAsJsonAsync(resultProject);
                return result;
            }
            catch (ProjectsApiException ex) when (ex.StatusCode == (int)HttpStatusCode.NotFound)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                await notFound.WriteStringAsync($"Project with id '{id}' not found.");
                return notFound;
            }
            catch (ProjectsApiException ex) when (ex.StatusCode == (int)HttpStatusCode.BadRequest)
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("Invalid project data.");
                return badRequest;
            }
        }

        [Function("DeleteProfessionalProject")]
        [OpenApiOperation(operationId: "DeleteProfessionalProject", tags: new[] { "ProfessionalProjects" }, Summary = "Delete a professional project", Visibility = OpenApiVisibilityType.Important)]
        [OpenApiSecurity("x-ms-client-principal-id", SecuritySchemeType.ApiKey, In = OpenApiSecurityLocationType.Header, Name = "X-MS-CLIENT-PRINCIPAL-ID")]
        [OpenApiParameter(name: "id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "Project ID")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NoContent, Description = "Successfully deleted")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NotFound, Description = "Project not found")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Unauthorized, Description = "Unauthorized")]
        public async Task<HttpResponseData> DeleteProfessionalProject(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "professional-projects/{id}")] HttpRequestData req,
            string id)
        {
            if (!AuthHelper.IsAuthenticated(req)) {
                return req.CreateResponse(HttpStatusCode.Unauthorized);
            }

            using var scope = _forwardingContext.ForwardRequestHeader(req);

            _logger.LogInformation("Deleting a professional project from the projects service.");

            try
            {
                await _projectsServiceClient.DeleteProfessionalProjectAsync(id);

                var result = req.CreateResponse(HttpStatusCode.NoContent);
                return result;
            }
            catch (ProjectsApiException ex) when (ex.StatusCode == (int)HttpStatusCode.NotFound)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                await notFound.WriteStringAsync($"Project with id '{id}' not found.");
                return notFound;
            }
        }
    }
}
