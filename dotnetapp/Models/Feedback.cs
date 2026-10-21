using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dotnetapp.Models
{
    public class Feedback
    {
        [Key]
        public int FeedbackId { get; set; }

        [Required(ErrorMessage = "User Id is required")]
        public int UserId { get; set; }

        public User? User { get; set; }

        [Required(ErrorMessage = "Feedback text is required")]
        [StringLength(500, ErrorMessage = "Feedback cannot exceed 500 characters")]
        public string FeedbackText { get; set; }

        [Required(ErrorMessage = "Date is required")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }
    }
}