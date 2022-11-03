using Microsoft.AspNetCore.Identity;

namespace netCoreApi.Models.Domain
{
    public class AppUser : IdentityUser
    {
        public string? Name { get; set; }  

    }
}
