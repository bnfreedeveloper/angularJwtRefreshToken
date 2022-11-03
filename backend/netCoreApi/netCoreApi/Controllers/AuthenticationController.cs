using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using netCoreApi.Data;
using netCoreApi.Models.Domain;
using netCoreApi.Models.Dtos;
using netCoreApi.Repositories.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace netCoreApi.Controllers
{
    [Route("api/[controller]/{action}")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly UserManager<AppUser> _userManag;
        //private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<IdentityRole>_roleManag;
        private readonly ITokenService _tokenService;

        public AuthenticationController(DatabaseContext context,UserManager<AppUser>usermanager,RoleManager<IdentityRole>roleManager,
            ITokenService tokenservice)
        {
           _context = context;
            _userManag = usermanager;
            _roleManag = roleManager;
            _tokenService = tokenservice;
        }
        [HttpPost]
        public async Task<IActionResult> Login(LoginDto login) {
            try{
                var user = await _userManag.FindByNameAsync(login.Username);
                if (user != null && await _userManag.CheckPasswordAsync(user, login.Password))
                {
                    var useroles = await _userManag.GetRolesAsync(user);
                    var claimList = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
                };
                    foreach (var role in useroles)
                    {
                        claimList.Add(new Claim(ClaimTypes.Role, role.ToString()));
                    }
                    var tokenDto = _tokenService.GetToken(claimList);
                    var refreshToken = _tokenService.GetRefreshToken();
                    var TokenUser = await _context.Tokens.FirstOrDefaultAsync(x => x.UserName == user.UserName);
                    if (TokenUser == null)
                    {
                        TokenUser = new Token
                        {
                            UserName = user.UserName,
                            RefreshToken = refreshToken,
                            Created = DateTime.Now.AddDays(7),

                        };
                        _context.Add(TokenUser);
                    }
                    else
                    {
                        TokenUser.RefreshToken = refreshToken;
                        TokenUser.Created = DateTime.Now.AddDays(7);
                    }
                    await _context.SaveChangesAsync();
                    return Ok(new LoginResponse
                    {
                        Success = true,
                        Name = user.Name,
                        UserName = user.UserName,
                        Token = tokenDto.Token,
                        RefreshToken = refreshToken,
                        Expiration = tokenDto.ValidTo
                    });

                }
                return BadRequest(new { success = false, error = "wrong credentials" });
            }
            catch (Exception ex)
            {
                return BadRequest("Something went wrong");
            }
            
        } 
    }
}
