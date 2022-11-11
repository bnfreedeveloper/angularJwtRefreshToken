using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace netCoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : ControllerBase
    {
        [HttpGet]
        public IActionResult test()
        {
            return Ok(new
            {

                message="only user and admin can see this"
            });
        }
        [HttpGet("private")]
        [Authorize(Roles="Admin")]
        public IActionResult testo()
        {
            return Ok(new
            {
                message = "only admin can see this message"
            });
        }
    }
}
