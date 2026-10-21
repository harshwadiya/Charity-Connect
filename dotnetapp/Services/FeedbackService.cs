using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class FeedbackService
    {
        private readonly ApplicationDbContext _context;

        public FeedbackService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Feedback>> GetAllFeedBacks()
        {
            return await _context.Feedbacks.Include(f => f.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<Feedback>> GetFeedbacksByUserId(int userId)
        {
            return await _context.Feedbacks.Include(f => f.User)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        public async Task<bool> AddFeedback(Feedback feedback)
        {
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteFeedback(int feedbackId)
        {
            var feedback = await _context.Feedbacks.FirstOrDefaultAsync(f => f.FeedbackId == feedbackId);
            if(feedback == null)
            {
                return false;
            }
            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}