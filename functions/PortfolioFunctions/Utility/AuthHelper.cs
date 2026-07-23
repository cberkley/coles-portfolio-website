using Microsoft.Azure.Functions.Worker.Http;
using System.Linq;
using System.Text;
using System.Text.Json;

namespace PortfolioFunctions.Utility
{
    public static class AuthHelper
    {
        public static bool IsAuthenticated(HttpRequestData req)
        {
            var expectedPrincipalIds = GetExpectedPrincipalIds();
            if (expectedPrincipalIds.Length == 0)
            {
                return false;
            }

            var principalId = GetClientPrincipalId(req);
            if (string.IsNullOrWhiteSpace(principalId))
            {
                return false;
            }

            var normalizedPrincipalId = NormalizePrincipalId(principalId);

            foreach (var expected in expectedPrincipalIds)
            {
                if (string.Equals(principalId.Trim(), expected, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }

                if (!string.IsNullOrWhiteSpace(normalizedPrincipalId) &&
                    string.Equals(normalizedPrincipalId, NormalizePrincipalId(expected), StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }

            return false;
        }

        private static string[] GetExpectedPrincipalIds()
        {
            var csv = Environment.GetEnvironmentVariable("AdminClientPrincipalIds");
            if (!string.IsNullOrWhiteSpace(csv))
            {
                return csv
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Where(value => !string.IsNullOrWhiteSpace(value))
                    .ToArray();
            }

            var single = Environment.GetEnvironmentVariable("AdminClientPrincipalId");
            if (string.IsNullOrWhiteSpace(single))
            {
                return Array.Empty<string>();
            }

            return new[] { single.Trim() };
        }

        private static string NormalizePrincipalId(string value)
        {
            return new string(value.Where(char.IsLetterOrDigit).ToArray()).ToLowerInvariant();
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

                if (doc.RootElement.TryGetProperty("claims", out var claims) && claims.ValueKind == JsonValueKind.Array)
                {
                    foreach (var claim in claims.EnumerateArray())
                    {
                        if (!claim.TryGetProperty("typ", out var typProp) || !claim.TryGetProperty("val", out var valProp))
                        {
                            continue;
                        }

                        var typ = typProp.GetString();
                        var val = valProp.GetString();
                        if (string.IsNullOrWhiteSpace(typ) || string.IsNullOrWhiteSpace(val))
                        {
                            continue;
                        }

                        if (typ.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", StringComparison.OrdinalIgnoreCase) ||
                            typ.Equals("sub", StringComparison.OrdinalIgnoreCase))
                        {
                            return val;
                        }
                    }
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
