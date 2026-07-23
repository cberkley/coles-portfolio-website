using Microsoft.Azure.Functions.Worker.Http;
using System.Text;
using System.Text.Json;

namespace PortfolioFunctions.Utility
{
    public static class AuthHelper
    {
        public static bool IsAuthenticated(HttpRequestData req)
        {
            var expectedPrincipalId = Environment.GetEnvironmentVariable("AdminClientPrincipalId");
            if (string.IsNullOrWhiteSpace(expectedPrincipalId))
            {
                return false;
            }

            var principalId = GetClientPrincipalId(req);
            if (string.IsNullOrWhiteSpace(principalId))
            {
                return false;
            }

            return string.Equals(
                principalId.Trim(),
                expectedPrincipalId.Trim(),
                StringComparison.OrdinalIgnoreCase);
        }

        public static string? GetClientPrincipalId(HttpRequestData req)
        {
            if (req.Headers.TryGetValues("X-MS-CLIENT-PRINCIPAL-ID", out var idValues))
            {
                var directId = System.Linq.Enumerable.FirstOrDefault(idValues);
                if (!string.IsNullOrWhiteSpace(directId))
                {
                    return directId;
                }
            }

            if (!req.Headers.TryGetValues("X-MS-CLIENT-PRINCIPAL", out var principalValues))
            {
                return null;
            }

            var encodedPrincipal = System.Linq.Enumerable.FirstOrDefault(principalValues);
            if (string.IsNullOrWhiteSpace(encodedPrincipal))
            {
                return null;
            }

            try
            {
                var normalized = encodedPrincipal.Replace('-', '+').Replace('_', '/');
                var padded = normalized.PadRight(normalized.Length + ((4 - normalized.Length % 4) % 4), '=');
                var decodedBytes = Convert.FromBase64String(padded);
                var decodedJson = Encoding.UTF8.GetString(decodedBytes);

                using var doc = JsonDocument.Parse(decodedJson);
                if (doc.RootElement.TryGetProperty("userId", out var userIdProp))
                {
                    return userIdProp.GetString();
                }
            }
            catch
            {
                return null;
            }

            return null;
        }
    }
}
