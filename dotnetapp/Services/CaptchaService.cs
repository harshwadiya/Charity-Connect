using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace dotnetapp.Services
{
    public class CaptchaService
    {
        private readonly HttpClient _httpClient;
        private readonly string _secretKey;

        public CaptchaService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _secretKey = configuration["GoogleRecaptcha:SecretKey"];
        }

        public async Task<bool> VerifyToken(string token)
        {
            if (string.IsNullOrEmpty(token)) return false;

            var values = new Dictionary<string, string>
            {
                { "secret", _secretKey },
                { "response", token }
            };

            var content = new FormUrlEncodedContent(values);
            var response = await _httpClient.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);

            if (!response.IsSuccessStatusCode) return false;

            var jsonString = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<CaptchaVerificationResponse>(jsonString);

            return result?.Success ?? false;
        }
    }

    public class CaptchaVerificationResponse
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }
    }
}