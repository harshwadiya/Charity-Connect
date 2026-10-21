using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using dotnetapp.Data;
using BCrypt.Net;

using dotnetapp.Models;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly RsaKeyService _rsaKeyService;

        public AuthService(ApplicationDbContext context, IConfiguration configuration, RsaKeyService rsaKeyService)
        {
            _context = context;
            _configuration = configuration;
            _rsaKeyService = rsaKeyService;
        }

        public async Task<(int, string)> Registration(User model, string role)
        {
            var existing = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (existing != null)
                return (0, "User with this email already exists");

            var existingUsername = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == model.Username.ToLower());

            if(existingUsername != null)
            {
                return (0, "This username is already taken, Please choose another one.");
            }

            if(role == "Admin")
            {
                const string SECRET_ADMIN_KEY = "CharityAdmin@123";
                if(string.IsNullOrEmpty(model.AdminKey) || model.AdminKey != SECRET_ADMIN_KEY)
                {
                    return (0, "Security Violation: Invalid Admin Registration Key");
                }
            } else 
            {
                role = "User";
            }

            string plainPassword = _rsaKeyService.Decrypt(model.Password);
            var user = new User
            {
                Email = model.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(plainPassword),
                Username = model.Username,
                MobileNumber = model.MobileNumber,
                UserRole = string.IsNullOrEmpty(role) ? "User" : role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            model.UserId = user.UserId;

            return (1, "User registered successfully");
        }

        public async Task<(int, string)> Login(LoginModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
                return (0, "Account not found with this email");

            
            string plainPassword = _rsaKeyService.Decrypt(model.Password);

            bool isValid = BCrypt.Net.BCrypt.Verify(plainPassword, user.Password);
            if (!isValid)
                return (0, "Incorrect password, Please try again");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.UserRole),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString())
            };

            var token = GenerateToken(claims);
            return (1, token);
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.UtcNow.AddHours(3),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}