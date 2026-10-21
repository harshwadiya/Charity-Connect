using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/feedbacks")]
    [Authorize]
    public class FeedbackController : ControllerBase
    {
        private readonly FeedbackService _feedbackService;

        public FeedbackController(FeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetAllFeedbacks()
        {
            try
            {
                var res = await _feedbackService.GetAllFeedBacks();
                return Ok(new
                {
                    message = "Feedbacks fetched successfully",
                    data = res
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, data = (object?)null });
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult> GetFeedbacksByUserId(int userId)
        {
            try
            {
                var res = await _feedbackService.GetFeedbacksByUserId(userId);

                if (res == null || !res.Any())
                {
                    return NotFound(new
                    {
                        message = "No feedbacks found for this user",
                        data = res
                    });
                }

                return Ok(new
                {
                    message = "User feedbacks fetched successfully",
                    data = res
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, data = (object?)null });
            }
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> AddFeedback([FromBody] Feedback feedback)
        {
            try
            {
                await _feedbackService.AddFeedback(feedback);
                return Ok(new
                {
                    message = "Feedback added successfully",
                    data = feedback
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, data = (object?)null });
            }
        }

        [HttpDelete("{feedbackId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult> DeleteFeedback(int feedbackId)
        {
            try
            {
                var res = await _feedbackService.DeleteFeedback(feedbackId);

                if (res)
                {
                    return Ok(new
                    {
                        message = "Feedback deleted successfully",
                        data = new { feedbackId }
                    });
                }

                return NotFound(new
                {
                    message = "Cannot find any feedback",
                    data = (object?)null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.Message,
                    data = (object?)null
                });
            }
        }
    }
}