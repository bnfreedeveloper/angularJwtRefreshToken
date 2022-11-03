using System.ComponentModel.DataAnnotations;

namespace netCoreApi.Models.Dtos
{
    public class RefreshTokenDto
    {
        [Required]
        public string RefreshToken { get; set; }
        [Required]
        public string Token { get; set; }
    }
}
