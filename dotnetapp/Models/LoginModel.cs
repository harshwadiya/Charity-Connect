using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dotnetapp.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [RegularExpression(@"^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Email cannot contain spaces")]
        public string Email { get; set; }
        
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        public string? CaptchaToken { get; set; }
    }

}

