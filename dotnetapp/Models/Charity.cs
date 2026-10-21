using System;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class Charity
    {
        [Key]
        public int CharityId { get; set; }

        [Required(ErrorMessage = "Charity name is required")]
        [StringLength(100, ErrorMessage = "Charity name cannot exceed 100 characters")]
        [RegularExpression(@"^[a-zA-Z0-9]([a-zA-Z0-9 ]*[a-zA-Z0-9])?$", ErrorMessage = "Charity name cannot start with a space or contain special characters")]
        public string CharityName { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [RegularExpression(@"^[a-zA-Z0-9]([a-zA-Z0-9 .,'-]*[a-zA-Z0-9.,'-])?$", ErrorMessage = "Description cannot start with a space or contain invalid characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Founder name is required")]
        [RegularExpression(@"^[a-zA-Z0-9]([a-zA-Z0-9 ]*[a-zA-Z0-9])?$", ErrorMessage = "Founder name cannot start with a space or contain special characters")]
        public string Founder { get; set; }

        [Required(ErrorMessage = "Creation date is required")]
        [DataType(DataType.Date)]
        public DateTime CreationDate { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; }
    }
}