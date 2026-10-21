using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;

namespace dotnetapp.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly CaptchaService _captchaService;

        public AuthenticationController(IAuthService authService, CaptchaService captchaService)
        {
            _authService = authService;
            _captchaService = captchaService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid payload");

                var isCaptchaValid = await _captchaService.VerifyToken(model.CaptchaToken);
                if (!isCaptchaValid)
                {
                    return BadRequest(new { Status = "Error", Message = "CAPTCHA validation failed. Please try again." });
                }

                var (status, result) = await _authService.Login(model);
                if (status == 0)
                    return BadRequest(new {Message = result});

                return Ok(new { Token = result , Message= "Login successfull" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid payload");

                var isCaptchaValid = await _captchaService.VerifyToken(model.CaptchaToken);
                if (!isCaptchaValid)
                {
                    return BadRequest(new { Status = "Error", Message = "CAPTCHA validation failed. Please try again." });
                }

                var (status, message) =
                    await _authService.Registration(model, model.UserRole);

                if (status == 0)
                    return BadRequest(new {Message = message});

                return Ok(new
                {
                    Message = message,
                    User = new
                    {
                        model.UserId,
                        model.Email,
                        model.Username,
                        model.MobileNumber,
                        model.UserRole
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}