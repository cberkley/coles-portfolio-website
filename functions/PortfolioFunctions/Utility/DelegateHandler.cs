using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace PortfolioFunctions.Utility
{
    public sealed class ForwardClientPrincipalHeaderHandler : DelegatingHandler
    {
        private readonly ClientPrincipalForwardingContext _context;

        public ForwardClientPrincipalHeaderHandler(ClientPrincipalForwardingContext context)
        {
            _context = context;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var principalId = _context.CurrentClientPrincipalId;

            if (!string.IsNullOrWhiteSpace(principalId) &&
                !request.Headers.Contains("X-MS-CLIENT-PRINCIPAL-ID"))
            {
                request.Headers.Add("X-MS-CLIENT-PRINCIPAL-ID", principalId);
            }

            return base.SendAsync(request, cancellationToken);
        }
    }
}