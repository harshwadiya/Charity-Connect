using dotnetapp.Models.Chatbot;
using System.Threading.Tasks;

namespace dotnetapp.Services
{
    public interface IChatbotService
    {
        Task<ChatResponse> GetReplyAsync(string message);
        bool IsAiEnabled();
    }
}