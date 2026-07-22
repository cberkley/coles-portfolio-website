using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using PortfolioFunctions.Clients.Experience;
using PortfolioFunctions.Utility;

namespace PortfolioFunctions.Functions
{
    public class WorkExperienceFunctions
    {
        private readonly ILogger _logger;
        private readonly ExperienceServiceClient _experienceServiceClient;
        private readonly ClientPrincipalForwardingContext _forwardingContext;

        public WorkExperienceFunctions(ILoggerFactory loggerFactory, ExperienceServiceClient experienceServiceClient, ClientPrincipalForwardingContext clientPrincipalForwardingContext)
        {
            _logger = loggerFactory.CreateLogger<WorkExperienceFunctions>();
            _experienceServiceClient = experienceServiceClient;
            _forwardingContext = clientPrincipalForwardingContext;
        }

        [Function("GetWorkExperiences")]
        [OpenApiOperation(operationId: "GetWorkExperiences", tags: new[] { "WorkExperiences" }, Summary = "Get all work experiences", Visibility = OpenApiVisibilityType.Important)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(List<WorkExperience>), Description = "List of work experiences")]
        public async Task<HttpResponseData> GetWorkExperiences(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "work-experiences")] HttpRequestData req)
        {
            _logger.LogInformation("Retrieving work experiences from the experience service.");

            var workExperiences = await _experienceServiceClient.GetWorkExperiencesAsync();

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(workExperiences);
            return response;
        }

        [Function("GetWorkExperienceById")]
        [OpenApiOperation(operationId: "GetWorkExperienceById", tags: new[] { "WorkExperiences" }, Summary = "Get a work experience by ID", Visibility = OpenApiVisibilityType.Important)]
        [OpenApiParameter(name: "id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "Work experience ID")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(WorkExperience), Description = "The requested work experience")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NotFound, Description = "Work experience not found")]
        public async Task<HttpResponseData> GetWorkExperienceById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "work-experiences/{id}")] HttpRequestData req,
            string id)
        {
            _logger.LogInformation("Retrieving a work experience by id from the experience service.");

            try
            {
                var workExperience = await _experienceServiceClient.GetWorkExperienceByIdAsync(id);
                var result = req.CreateResponse(HttpStatusCode.OK);
                await result.WriteAsJsonAsync(workExperience);
                return result;
            }
            catch (ExperienceApiException ex) when (ex.StatusCode == (int)HttpStatusCode.NotFound)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                await notFound.WriteStringAsync($"Work experience with id '{id}' not found.");
                return notFound;
            }
        }

        [Function("AddWorkExperience")]
        [OpenApiOperation(operationId: "AddWorkExperience", tags: new[] { "WorkExperiences" }, Summary = "Add a new work experience", Visibility = OpenApiVisibilityType.Important)]
        [OpenApiSecurity("x-ms-client-principal-id", SecuritySchemeType.ApiKey, In = OpenApiSecurityLocationType.Header, Name = "X-MS-CLIENT-PRINCIPAL-ID")]
        [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(WorkExperience), Required = true, Description = "The work experience to create")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.Created, contentType: "application/json", bodyType: typeof(WorkExperience), Description = "The created work experience")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.BadRequest, Description = "Invalid work experience data")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Unauthorized, Description = "Unauthorized")]
        public async Task<HttpResponseData> AddWorkExperience(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "work-experiences")] HttpRequestData req)
        {
            if (!AuthHelper.IsAuthenticated(req)) {
                return req.CreateResponse(HttpStatusCode.Unauthorized);
            }

            _logger.LogInformation("Adding a work experience to the experience service.");

            //we need to forward the client principal ID to the downstream service
            //this is important so that in the future I can also implement a front end 
            // on that service and also use the same authentication and authorization 
            // mechanism
            using var scope = _forwardingContext.ForwardRequestHeader(req);

            var workExperience = await req.ReadFromJsonAsync<WorkExperience>();
            if (workExperience == null || string.IsNullOrWhiteSpace(workExperience.Company))
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("A work experience with at least a 'company' is required.");
                return badRequest;
            }

            if (string.IsNullOrWhiteSpace(workExperience.Id))
            {
                workExperience.Id = Guid.NewGuid().ToString();
            }

            var created = await _experienceServiceClient.AddWorkExperienceAsync(workExperience);

            var response = req.CreateResponse(HttpStatusCode.Created);
            await response.WriteAsJsonAsync(created);
            return response;
        }

        [Function("UpdateWorkExperience")]
        [OpenApiOperation(operationId: "UpdateWorkExperience", tags: new[] { "WorkExperiences" }, Summary = "Update an existing work experience", Visibility = OpenApiVisibilityType.Important)]
        [OpenApiSecurity("x-ms-client-principal-id", SecuritySchemeType.ApiKey, In = OpenApiSecurityLocationType.Header, Name = "X-MS-CLIENT-PRINCIPAL-ID")]
        [OpenApiParameter(name: "id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "Work Experience ID")]
        [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(WorkExperience), Required = true, Description = "The updated work experience data")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(WorkExperience), Description = "The updated work experience")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.BadRequest, Description = "Invalid work experience data")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NotFound, Description = "Work experience not found")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Unauthorized, Description = "Unauthorized")]
        public async Task<HttpResponseData> UpdateWorkExperience(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "work-experiences/{id}")] HttpRequestData req,
            string id)
        {
            if (!AuthHelper.IsAuthenticated(req)) {
                return req.CreateResponse(HttpStatusCode.Unauthorized);
            }

            using var scope = _forwardingContext.ForwardRequestHeader(req);

            _logger.LogInformation("Updating a work experience in Cosmos DB.");

            var updatedWorkExperience = await req.ReadFromJsonAsync<WorkExperience>();
            if (updatedWorkExperience == null || string.IsNullOrWhiteSpace(updatedWorkExperience.Company))
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequest.WriteStringAsync("A work experience with at least a 'company' is required.");
                return badRequest;
            }

            updatedWorkExperience.Id = id;

            try
            {
                var updated = await _experienceServiceClient.UpdateWorkExperienceAsync(id, updatedWorkExperience);

                var result = req.CreateResponse(HttpStatusCode.OK);
                await result.WriteAsJsonAsync(updated);
                return result;
            }
            catch (ExperienceApiException ex) when (ex.StatusCode == (int)HttpStatusCode.NotFound)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                await notFound.WriteStringAsync($"Work experience with id '{id}' not found.");
                return notFound;
            }
        }

        [Function("DeleteWorkExperience")]
        [OpenApiOperation(operationId: "DeleteWorkExperience", tags: new[] { "WorkExperiences" }, Summary = "Delete a work experience", Visibility = OpenApiVisibilityType.Important)]
        [OpenApiSecurity("x-ms-client-principal-id", SecuritySchemeType.ApiKey, In = OpenApiSecurityLocationType.Header, Name = "X-MS-CLIENT-PRINCIPAL-ID")]
        [OpenApiParameter(name: "id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "Work experience ID")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NoContent, Description = "Successfully deleted")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.NotFound, Description = "Work experience not found")]
        [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Unauthorized, Description = "Unauthorized")]
        public async Task<HttpResponseData> DeleteWorkExperience(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "work-experiences/{id}")] HttpRequestData req,
            string id)
        {
            if (!AuthHelper.IsAuthenticated(req))
                return req.CreateResponse(HttpStatusCode.Unauthorized);

            _logger.LogInformation("Deleting a work experience from the experience service.");

            using var scope = _forwardingContext.ForwardRequestHeader(req);

            try
            {
                await _experienceServiceClient.DeleteWorkExperienceAsync(id);
                var result = req.CreateResponse(HttpStatusCode.NoContent);
                return result;
            }
            catch (ExperienceApiException ex) when (ex.StatusCode == (int)HttpStatusCode.NotFound)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                await notFound.WriteStringAsync($"Work experience with id '{id}' not found.");
                return notFound;
            }
        }
    }
}
