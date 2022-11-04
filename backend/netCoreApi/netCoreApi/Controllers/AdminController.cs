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
            return Ok("only admin or user can see this message");
        }
        [HttpGet("private")]
        [Authorize(Roles="Admin")]
        public IActionResult testo()
        {
            return Ok("only admin can see this message");
        }
    }
}
