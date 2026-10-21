using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using dotnetapp.Models;
using dotnetapp.Services;
using dotnetapp.Exceptions;

namespace dotnetapp.Controllers
{
    [Route("api/charities")]
    [ApiController]
    [Authorize]
    public class CharityController : ControllerBase
    {
        private readonly CharityService _charityService;

        public CharityController(CharityService charityService)
        {
            _charityService = charityService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<IEnumerable<Charity>>> GetAllCharities()
        {
            try
            {
                var charities = await _charityService.GetAllCharities();
                return Ok(charities);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{charityId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Charity>> GetCharityById(int charityId)
        {
            try
            {
                var charity = await _charityService.GetCharityById(charityId);
                if (charity == null)
                    return NotFound("Cannot find any charity");

                return Ok(charity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AddCharity([FromBody] Charity charity)
        {
            try
            {
                var result = await _charityService.AddCharity(charity);
                
                if (!result)
                {
                    return StatusCode(500, "Failed to add charity");
                }
                var added = await _charityService.GetCharityById(charity.CharityId);
                return Ok(new {
                        message = "Charity added successfully",
                        charity = added
                });
            }
            catch (CharityException ex)
            {
                return StatusCode(500, ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{charityId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateCharity(int charityId, [FromBody] Charity charity)
        {
            try
            {
                var result = await _charityService.UpdateCharity(charityId, charity);
                if (!result)
                    return NotFound("Cannot find any charity");

                var updated = await _charityService.GetCharityById(charityId);

                return Ok(new
                {
                    message = "Charity updated successfully",
                    charity = updated
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{charityId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteCharity(int charityId)
        {
            try
            {
                var result = await _charityService.DeleteCharity(charityId);
                if (!result)
                    return NotFound("Cannot find any charity");
                
                return Ok(new
                {
                    message = "Charity deleted successfully"
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}