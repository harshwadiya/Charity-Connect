using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dotnetapp.Models
{
    public class Donation
    {
        [Key]
        public int DonationId { get; set; }

        public int? CharityId { get; set; }

        public Charity? Charity { get; set; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(1, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Donation date is required")]
        [DataType(DataType.Date)]
        public DateTime DonationDate { get; set; }

        [Required(ErrorMessage = "User Id is required")]
        public int UserId { get; set; }

        public User? User { get; set; }
    }
}