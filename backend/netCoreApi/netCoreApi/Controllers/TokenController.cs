using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using netCoreApi.Data;
using netCoreApi.Models.Dtos;
using netCoreApi.Repositories.Interfaces;

namespace netCoreApi.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly DatabaseContext _ctx;
        private readonly ITokenService _tokenService;
        public TokenController(DatabaseContext context,ITokenService tokenservice)
        {
            _ctx = context; 
            _tokenService = tokenservice;   
        }
        [HttpPost]
        public async Task<IActionResult> Refresh(RefreshTokenDto refresh)
        {
            if (!ModelState.IsValid) return BadRequest(new { success = false, error = "infos provided are wrong" });
            string accessToken = refresh.Token;
            string refreshToken = refresh.RefreshToken;
            try
            {
                var principl = _tokenService.GetPrincipalFromExpiredToken(accessToken);
                var username = principl?.Identity?.Name;

                var token = await _ctx.Tokens.SingleOrDefaultAsync(token => token.UserName == username);
                if (token is null || token.RefreshToken != refreshToken || token.Created <= DateTime.Now)
                {
                    return BadRequest(new { success = false, error = "invalid client request" });
                }
                var newRefreshToken = _tokenService.GetRefreshToken();
                var newAccessToken = _tokenService.GetToken(principl.Claims);
                token.RefreshToken = newRefreshToken;
                await _ctx.SaveChangesAsync();
                return Ok(new RefreshTokenDto { RefreshToken = newRefreshToken, Token = newAccessToken.Token });
            }
            catch(Exception ex)
            {
                return BadRequest(new { success = false, error = "something went wrong" });
            }
        }

        [HttpPost("revoke")]
        [Authorize]
        public async Task<ActionResult<Boolean>> Revoke()
        {
            try
            {
                var username = User.Identity.Name;
                var user = await _ctx.Tokens.SingleOrDefaultAsync(x => x.UserName == username);
                if (user == null) return BadRequest(new { success = false, error = "request invalid" });
                user.RefreshToken = null;
                await _ctx.SaveChangesAsync();
                return Ok(true);
            }catch(Exception ex)
            {
                return BadRequest(new { success = false, error = "something went wrong!" });
            }
        }
    }
}
