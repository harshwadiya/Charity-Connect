using dotnetapp.Models.Chatbot;
using dotnetapp.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatbotController : ControllerBase
    {
        private readonly IChatbotService _chatbotService;

        public ChatbotController(IChatbotService chatbotService)
        {
            _chatbotService = chatbotService;
        }

        [HttpGet("status")]
        public IActionResult Status()
        {
            return Ok(new { aiAvailable = _chatbotService.IsAiEnabled() });
        }

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] ChatRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { message = "Message is required" });
            }

            var result = await _chatbotService.GetReplyAsync(request.Message);
            return Ok(result);
        }
    }
}