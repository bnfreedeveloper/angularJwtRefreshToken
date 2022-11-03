using netCoreApi.Models.Domain;
using netCoreApi.Models.Dtos;
using System.Security.Claims;

namespace netCoreApi.Repositories.Interfaces
{
    public interface ITokenService
    {
        TokenDto GetToken(IEnumerable<Claim> claims);
        string GetRefreshToken();
       ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
