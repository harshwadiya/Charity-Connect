using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
    public class CharityService
    {
        private readonly ApplicationDbContext _context;

        public CharityService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Charity>> GetAllCharities()
        {
            return await _context.Charities.ToListAsync();
        }

        public async Task<Charity> GetCharityById(int charityId)
        {
            return await _context.Charities.FindAsync(charityId);
        }

        public async Task<bool> AddCharity(Charity charity)
        {
            var exists = await _context.Charities.FirstOrDefaultAsync(c => c.CharityName == charity.CharityName);
            if (exists != null)
                throw new CharityException("Charity with the same name already exists");

            _context.Charities.Add(charity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateCharity(int charityId, Charity charity)
        {
            var existing = await _context.Charities.FindAsync(charityId);
            if (existing == null) return false;

            existing.CharityName = charity.CharityName;
            existing.Description = charity.Description;
            existing.Founder = charity.Founder;
            existing.CreationDate = charity.CreationDate;
            existing.Status = charity.Status;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCharity(int charityId)
        {
            var charity = await _context.Charities.FindAsync(charityId);
            if (charity == null) return false;

            _context.Charities.Remove(charity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}