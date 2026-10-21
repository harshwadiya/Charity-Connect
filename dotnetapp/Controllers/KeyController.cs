using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using dotnetapp.Services;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/key")]
    public class KeyController : ControllerBase
    {
        private readonly RsaKeyService _rsaKeyService;

        public KeyController(RsaKeyService rsaKeyService)
        {
            _rsaKeyService = rsaKeyService;
        }

        [HttpGet("public")]
        public IActionResult GetPublicKey()
        {
            return Ok(new { publicKey = _rsaKeyService.GetPublicKey() });
        }
        
    }
}