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
    [Route("api/[controller]")]
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
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]LoginDto login) {
            try{
                var user = await _userManag.FindByNameAsync(login.Username);
                if (user != null && await _userManag.CheckPasswordAsync(user, login.Password))
                {
                    var useroles = await _userManag.GetRolesAsync(user);
                    var claimList = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
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
                        Expiration = tokenDto.ValidTo,
                        Message ="successfully logged in"
                    });

                }
                return BadRequest(new { success = false, error = "wrong credentials" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = "something went wrong" });
            }
            
        } 
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationDto registration)
        {
            if (!ModelState.IsValid) return BadRequest(new { success = false, error = "missing fields required" });
            var checkUser = await _userManag.FindByNameAsync(registration.Username);
            if(checkUser != null)
            {
                return BadRequest(new { success = false, error = "username already taken" });
            }
            var user = new AppUser
            {
                Name = registration.Name,
                UserName = registration.Username,
                SecurityStamp = Guid.NewGuid().ToString(),
                Email = registration.Email,
            };
            var result = await _userManag.CreateAsync(user,registration.Password);  
            if (!result.Succeeded)
            {
                return StatusCode(500,new { success = false, error = "user registration failed" });
            }

            //checking and adding role if necessary 
            if (!await _roleManag.RoleExistsAsync(UserRoles.Admin)) await _roleManag.CreateAsync(new IdentityRole
            {
                Name = UserRoles.Admin
            });
            if(!await _roleManag.RoleExistsAsync(UserRoles.User))
            {
                await _roleManag.CreateAsync(new IdentityRole(UserRoles.User));
            }
            //we can check for a special user name(not username) and add the admin role 
            //for the owner of the web app for ex 
            if(user.Name =="jean valjeant") //we should check also for a special email adress too
            {
                var chechRoleAdd = await _userManag.AddToRoleAsync(user, UserRoles.Admin);
                if (!chechRoleAdd.Succeeded)
                {
                    return StatusCode(500, new { success = false, error = "user registration failed" });
                }
            }
            //adding user right to new registered user
            var chechRoleAdded = await _userManag.AddToRoleAsync(user, UserRoles.User);
            if (!chechRoleAdded.Succeeded)
            {
                return StatusCode(500, new { success = false, error = "user registration failed" });
            }
            return Ok(new { success = true, message = "registration was susccessfull" });

        }
        [HttpPost("changePassword")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> ChangePassword(changePasswordDto changePassword)
        {
            if(!ModelState.IsValid) return BadRequest(new { success = false, error = "fields not valid" });

            //we check if user exists
            var user = await _userManag.FindByNameAsync(changePassword.UserName);
            if(user == null) return BadRequest(new { success = false, error = "user not found" });
            //we then check if the password match
            if(!await _userManag.CheckPasswordAsync(user, changePassword.Current))
            {
               return BadRequest(new { success = false, error = "invalid current password" });
            }
            //here we gonna change the password
            var result = await _userManag.ChangePasswordAsync(user, changePassword.Current, changePassword.NewPassword);
            if (!result.Succeeded)
            {
                return StatusCode(500, new { success = false, error = "change password failed" });
            }
            return Ok(new { success = true, message = "password successfully changed" });

        }
    }
}
