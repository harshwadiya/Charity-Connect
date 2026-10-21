using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class DonationService
    {
        private readonly ApplicationDbContext _context;


        public DonationService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Donation>> GetAllDonations()
        {
            return await _context.Donations
                .Include(d => d.User)
                .Include(d => d.Charity)
                .ToListAsync();
        }

        public async Task<IEnumerable<Donation>> GetDonationsByUserId(int userId)
        {
            return await _context.Donations
                .Include(d => d.User)
                .Include(d => d.Charity)
                .Where(d => d.UserId == userId)
                .ToListAsync();
        }

        public async Task<bool> AddDonation(Donation donation)
        {
            _context.Donations.Add(donation);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<Donation>> GetDonationsByCharityId(int charityId)
        {
            return await _context.Donations
                .Include(d => d.User)
                .Include(d => d.Charity)
                .Where(d => d.CharityId == charityId)
                .ToListAsync();
        }
    }

}