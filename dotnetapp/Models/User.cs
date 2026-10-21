using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dotnetapp.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [RegularExpression(@"^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Email cannot contain spaces")]
 
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, ErrorMessage = "Username cannot exceed 50 characters")]
        [RegularExpression(@"^[a-zA-Z0-9]([a-zA-Z0-9 ]*[a-zA-Z0-9])?$", ErrorMessage = "Username cannot start with a space or contain special characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Mobile number is required")]
        [RegularExpression(@"^[6-9][0-9]{9}$", ErrorMessage = "Mobile number must start with 6-9, be exactly 10 digits, and contain no spaces")]
        public string MobileNumber { get; set; }

        [Required(ErrorMessage = "User role is required")]
        public string UserRole { get; set; }

        [NotMapped]
        public string? CaptchaToken { get; set; }
        
        [NotMapped]
        public string? AdminKey {get;set;}
    }
}