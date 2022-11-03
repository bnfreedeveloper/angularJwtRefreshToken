using Microsoft.IdentityModel.Tokens;
using netCoreApi.Models.Domain;
using netCoreApi.Models.Dtos;
using netCoreApi.Repositories.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace netCoreApi.Repositories.Domains
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration; 
        public TokenService(IConfiguration config)
        {
            _configuration = config;    
        }
        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters {
            ValidateAudience = true,
            ValidateIssuer = true,  
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"])),
            ValidateLifetime = false,
            ValidIssuer =_configuration["Jwt:ValidIssuer"],
            ValidAudience = _configuration["Jwt:ValidAudience"],
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken tokenSecurity;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters,out tokenSecurity); 
            var jwtSecurityToken = tokenSecurity as JwtSecurityToken;   
            if (jwtSecurityToken == null || ! jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256))
            {
                throw new SecurityTokenException("invalid token");
            }
            return principal;
        }

        public string GetRefreshToken()
        {
           var randomNumber = new Byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber); 
                return Convert.ToBase64String(randomNumber);    
            }
        }

        public TokenDto GetToken(IEnumerable<Claim> claims)
        {
            var authKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));
            var tokenSecurity = new JwtSecurityToken(
                issuer: _configuration["Jwt:ValidIssuer"],
                audience: _configuration["Jwt:ValidAudience"],
                claims: claims,
                signingCredentials: new SigningCredentials(authKey, SecurityAlgorithms.HmacSha256),
                //delay for testing purpose
                expires: DateTime.Now.AddMinutes(2)
                ) ;
            string token = new JwtSecurityTokenHandler().WriteToken(tokenSecurity);
            return new TokenDto
            {
                Token = token,
                ValidTo = tokenSecurity.ValidTo,
            };
        }
    }
}
