using dotnetapp.Models.Chatbot;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace dotnetapp.Services
{
    public class ChatbotService : IChatbotService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _http;

        public ChatbotService(IConfiguration config, IHttpClientFactory httpFactory)
        {
            _config = config;
            _http = httpFactory.CreateClient();
        }

        public bool IsAiEnabled()
        {
            var enabled = _config.GetValue<bool>("AISettings:Enabled");
            var apiKey = _config["AISettings:ApiKey"];

            return enabled && !string.IsNullOrWhiteSpace(apiKey);
        }

        public async Task<ChatResponse> GetReplyAsync(string message)
        {
            if (!IsAiEnabled())
            {
                return new ChatResponse { Reply = "AI not enabled", AiAvailable = false };
            }

            try
            {
                var apiKey = _config["AISettings:ApiKey"];
                var apiUrl = _config["AISettings:ApiUrl"];
                var model = _config["AISettings:Model"];
                var systemPrompt = _config["AISettings:SystemPrompt"];

                var body = new
                {
                    model = model,
                    messages = new[]
                    {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = message }
            },
                    temperature = 0.7,
                    max_tokens = 200
                };

                var json = JsonSerializer.Serialize(body);
                var content = new StringContent(json, Encoding.UTF8, "application/json");


                _http.DefaultRequestHeaders.Clear();
                _http.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                var response = await _http.PostAsync(apiUrl, content);
                var result = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return new ChatResponse
                    {
                        Reply = "",
                        AiAvailable = false
                    };
                }

                using var doc = JsonDocument.Parse(result);


                var reply = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                return new ChatResponse
                {
                    Reply = reply?.Trim() ?? "",
                    AiAvailable = true
                };
            }
            catch (Exception ex)
            {
                return new ChatResponse
                {
                    Reply ="",
                    AiAvailable = false
                };
            }
        }
    }
}
