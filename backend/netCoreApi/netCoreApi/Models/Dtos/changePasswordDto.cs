using System.ComponentModel.DataAnnotations;

namespace netCoreApi.Models.Dtos
{
    public class changePasswordDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Current { get; set; }
        [Required]
        public string NewPassword { get; set; }
        [Required]
        [Compare("NewPassword")]
        public string ConfirmNewP { get; set; } 

    }
}
