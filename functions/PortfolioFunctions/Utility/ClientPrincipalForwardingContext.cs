using Microsoft.Azure.Functions.Worker.Http;

namespace PortfolioFunctions.Utility
{
    public sealed class ClientPrincipalForwardingContext
    {
        private static readonly AsyncLocal<string?> CurrentPrincipalId = new();

        public string? CurrentClientPrincipalId => CurrentPrincipalId.Value;

        public IDisposable BeginScope(string? clientPrincipalId)
        {
            var previous = CurrentPrincipalId.Value;
            CurrentPrincipalId.Value = clientPrincipalId;
            return new RestoreScope(previous);
        }

        // Forward the client principal ID from the request header to the downstream service
        internal IDisposable ForwardRequestHeader(HttpRequestData req)
        {
            req.Headers.TryGetValues("X-MS-CLIENT-PRINCIPAL-ID", out var values);
            var clientPrincipalId = values?.FirstOrDefault();
            var scope = BeginScope(clientPrincipalId);
            
            return scope;
        }

        private sealed class RestoreScope : IDisposable
        {
            private readonly string? _previous;
            private bool _disposed;

            public RestoreScope(string? previous)
            {
                _previous = previous;
            }

            public void Dispose()
            {
                if (_disposed) return;
                CurrentPrincipalId.Value = _previous;
                _disposed = true;
            }
        }
    }
}