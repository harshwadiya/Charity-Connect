using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapp.Controllers
{
    [Route("api/donations")]
    [ApiController]
    [Authorize]
    public class DonationController : ControllerBase
    {
        private readonly DonationService _donationService;

        public DonationController(DonationService donationService)
        {
            _donationService = donationService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetAllDonations()
        {
            try
            {
                var res = await _donationService.GetAllDonations();
                return Ok(new
                {
                    message = "Donations fetched successfully",
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
        public async Task<ActionResult> AddDonation([FromBody] Donation donation)
        {
            try
            {
                var res = await _donationService.AddDonation(donation);

                if (res)
                {
                    return Ok(new
                    {
                        message = "Donation added successfully",
                        data = donation
                    });
                }

                return StatusCode(500, new
                {
                    message = "Failed to add donation",
                    data = (object?)null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, data = (object?)null });
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult> GetDonationsByUserId(int userId)
        {
            try
            {
                var res = await _donationService.GetDonationsByUserId(userId);
                return Ok(new
                {
                    message = "User donations fetched successfully",
                    data = res
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, data = (object?)null });
            }
        }

        [HttpGet("charity/{charityId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetDonationsByCharityId(int charityId)
        {
            try
            {
                var res = await _donationService.GetDonationsByCharityId(charityId);
                return Ok(new
                {
                    message = "Charity donations fetched successfully",
                    data = res
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, data = (object?)null });
            }
        }
    }
}