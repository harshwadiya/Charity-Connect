using dotnetapp.Exceptions;
using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Linq;
using System.Reflection;
using dotnetapp.Services;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;

namespace dotnetapp.Tests
{
    [TestFixture]
    public class Tests
    {

        private ApplicationDbContext _context; 
        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: "TestDatabase").Options;
            _context = new ApplicationDbContext(options);
           
             _httpClient = new HttpClient();
             _httpClient.BaseAddress = new Uri("http://localhost:8080");

        }

        [TearDown]
        public void TearDown()
        {
             _context.Dispose();
        }

   [Test, Order(1)]
    public async Task Backend_Test_Post_Method_Register_Admin_Returns_HttpStatusCode_OK()
    {
        ClearDatabase();
        string uniqueId = Guid.NewGuid().ToString();

        // Generate a unique userName based on a timestamp
        string uniqueUsername = $"abcd_{uniqueId}";
        string uniqueEmail = $"abcd{uniqueId}@gmail.com";

        string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Admin\"}}";
        HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

        Console.WriteLine(response.StatusCode);
        string responseString = await response.Content.ReadAsStringAsync();

        Console.WriteLine(responseString);
        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
    }
  
   [Test, Order(2)]
    public async Task Backend_Test_Post_Method_Login_Admin_Returns_HttpStatusCode_OK()
    {
        ClearDatabase();

        string uniqueId = Guid.NewGuid().ToString();

        // Generate a unique userName based on a timestamp
        string uniqueUsername = $"abcd_{uniqueId}";
        string uniqueEmail = $"abcd{uniqueId}@gmail.com";

        string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Admin\"}}";
        HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

        // Print registration response
        string registerResponseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Registration Response: " + registerResponseBody);

        // Login with the registered user
        string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
        HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

        // Print login response
        string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Login Response: " + loginResponseBody);

        Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
    }
   
   [Test, Order(3)]
public async Task Backend_Test_Get_All_Charities_With_Token_By_User_Returns_HttpStatusCode_OK()
{
    ClearDatabase();
    string uniqueId = Guid.NewGuid().ToString();

    // Generate a unique userName based on a timestamp
    string uniqueUsername = $"abcd_{uniqueId}";
    string uniqueEmail = $"abcd{uniqueId}@gmail.com";

    string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"User\"}}";
    HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

    // Print registration response
    string registerResponseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Registration Response: " + registerResponseBody);

    // Login with the registered user
    string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
    HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

    // Print login response
    string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
    Console.WriteLine("Login Response: " + loginResponseBody);

    Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
    string responseBody = await loginResponse.Content.ReadAsStringAsync();

    dynamic responseMap = JsonConvert.DeserializeObject(responseBody);

    string token = responseMap.token;

    Assert.IsNotNull(token);

    // Use the token to get all feeds
    _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
    HttpResponseMessage apiResponse = await _httpClient.GetAsync("/api/charities");

    // Print feed response
    string apiResponseBody = await apiResponse.Content.ReadAsStringAsync();
    Console.WriteLine("apiResponseBody: " + apiResponseBody);

    Assert.AreEqual(HttpStatusCode.OK, apiResponse.StatusCode);
}


[Test, Order(4)]
public async Task Backend_Test_Get_All_Charities_Without_Token_By_User_Returns_HttpStatusCode_Unauthorized()
{
    ClearDatabase();
    string uniqueId = Guid.NewGuid().ToString();

    // Generate a unique userName based on a timestamp
    string uniqueUsername = $"abcd_{uniqueId}";
    string uniqueEmail = $"abcd{uniqueId}@gmail.com";

    string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"User\"}}";
    HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

    // Print registration response
    string registerResponseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Registration Response: " + registerResponseBody);

    // Login with the registered user
    string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
    HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

    // Print login response
    string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
    Console.WriteLine("Login Response: " + loginResponseBody);

    Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
    string responseBody = await loginResponse.Content.ReadAsStringAsync();

    HttpResponseMessage apiResponse = await _httpClient.GetAsync("/api/charities");

    // Print feed response
    string apiResponseBody = await apiResponse.Content.ReadAsStringAsync();
    Console.WriteLine("apiResponseBody: " + apiResponseBody);

    Assert.AreEqual(HttpStatusCode.Unauthorized, apiResponse.StatusCode);
}

[Test, Order(5)]
public async Task Backend_Test_GetAll_Method_Get_All_Charities_In_Charity_Service_Fetches_All_Charities_Successfully()
{
    ClearDatabase();

    // Set up charity data
    var charityData1 = new Dictionary<string, object>
    {
        { "CharityId", 1 },
        { "CharityName", "Charity One" },
        { "Description", "First charity description" },
        { "Founder", "Founder One" },
        { "CreationDate", DateTime.Now },
        { "Status", "Active" }
    };

    var charityData2 = new Dictionary<string, object>
    {
        { "CharityId", 2 },
        { "CharityName", "Charity Two" },
        { "Description", "Second charity description" },
        { "Founder", "Founder Two" },
        { "CreationDate", DateTime.Now },
        { "Status", "Inactive" }
    };

    var charity1 = new Charity();
    foreach (var kvp in charityData1)
    {
        var propertyInfo = typeof(Charity).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(charity1, kvp.Value);
        }
    }

    var charity2 = new Charity();
    foreach (var kvp in charityData2)
    {
        var propertyInfo = typeof(Charity).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(charity2, kvp.Value);
        }
    }

    _context.Charities.Add(charity1);
    _context.Charities.Add(charity2);
    await _context.SaveChangesAsync();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.CharityService";

    Type serviceType = assembly.GetType(serviceName);

    // Get the GetAllCharities method
    MethodInfo getAllCharitiesMethod = serviceType.GetMethod("GetAllCharities");

    // Check if method exists
    if (getAllCharitiesMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var retrievedCharitiesTask = (Task<IEnumerable<Charity>>)getAllCharitiesMethod.Invoke(service, null);
        var retrievedCharities = await retrievedCharitiesTask;

        // Assert the retrieved charities are not null and match the expected count
        Assert.IsNotNull(retrievedCharities);
        Assert.AreEqual(2, retrievedCharities.Count());
    }
    else
    {
        Assert.Fail();
    }
}
[Test, Order(6)]
public async Task Backend_Test_Get_Method_Get_Charity_By_Id_In_Charity_Service_Fetches_Charity_Successfully()
{
    ClearDatabase();

    // Set up charity data
    var charityData = new Dictionary<string, object>
    {
        { "CharityId", 1 },
        { "CharityName", "Charity One" },
        { "Description", "First charity description" },
        { "Founder", "Founder One" },
        { "CreationDate", DateTime.Now },
        { "Status", "Active" }
    };

    var charity = new Charity();
    foreach (var kvp in charityData)
    {
        var propertyInfo = typeof(Charity).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(charity, kvp.Value);
        }
    }

    _context.Charities.Add(charity);
    await _context.SaveChangesAsync();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.CharityService";

    Type serviceType = assembly.GetType(serviceName);

    // Get the GetCharityById method
    MethodInfo getCharityByIdMethod = serviceType.GetMethod("GetCharityById");

    // Check if method exists
    if (getCharityByIdMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var retrievedCharityTask = (Task<Charity>)getCharityByIdMethod.Invoke(service, new object[] { 1 });
        var retrievedCharity = await retrievedCharityTask;

        // Assert the retrieved charity is not null and properties match
        Assert.IsNotNull(retrievedCharity);
        Assert.AreEqual(charity.CharityName, retrievedCharity.CharityName);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(7)]
public async Task Backend_Test_Post_Method_Add_Charity_In_Charity_Service_Adds_Charity_Successfully()
{
    ClearDatabase();

    // Set up charity data
    var charityData = new Dictionary<string, object>
    {
        { "CharityId", 1 },
        { "CharityName", "Charity One" },
        { "Description", "First charity description" },
        { "Founder", "Founder One" },
        { "CreationDate", DateTime.Now},
        { "Status", "Active" }
    };

    var charity = new Charity();
    foreach (var kvp in charityData)
    {
        var propertyInfo = typeof(Charity).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(charity, kvp.Value);
        }
    }

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.CharityService";

    Type serviceType = assembly.GetType(serviceName);

    // Get the AddCharity method
    MethodInfo addCharityMethod = serviceType.GetMethod("AddCharity");

    // Check if method exists
    if (addCharityMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var addCharityTask = (Task<bool>)addCharityMethod.Invoke(service, new object[] { charity });
        var result = await addCharityTask;

        // Assert that the charity was added successfully
        Assert.IsTrue(result);

        // Verify that the charity was added
        var retrievedCharity = await _context.Charities.FindAsync(1);

        // Assert the retrieved charity is not null and properties match
        Assert.IsNotNull(retrievedCharity);
        Assert.AreEqual(charity.CharityName, retrievedCharity.CharityName);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(8)]
public async Task Backend_Test_Delete_Method_Delete_Charity_In_Charity_Service_Deletes_Charity_Successfully()
{
    ClearDatabase();

    // Set up charity data
    var charityData = new Dictionary<string, object>
    {
        { "CharityId", 1 },
        { "CharityName", "Charity One" },
        { "Description", "First charity description" },
        { "Founder", "Founder One" },
        { "CreationDate", DateTime.Now },
        { "Status", "Active" }
    };

    var charity = new Charity();
    foreach (var kvp in charityData)
    {
        var propertyInfo = typeof(Charity).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(charity, kvp.Value);
        }
    }
    _context.Charities.Add(charity);
    await _context.SaveChangesAsync();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.CharityService";

    Type serviceType = assembly.GetType(serviceName);

    // Get the DeleteCharity method
    MethodInfo deleteCharityMethod = serviceType.GetMethod("DeleteCharity");

    // Check if method exists
    if (deleteCharityMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var deleteCharityTask = (Task<bool>)deleteCharityMethod.Invoke(service, new object[] { 1 });
        var result = await deleteCharityTask;

        // Assert that the charity was deleted successfully
        Assert.IsTrue(result);

        // Verify that the charity was deleted
        var retrievedCharity = await _context.Charities.FindAsync(1);

        // Assert the retrieved charity is null, indicating deletion
        Assert.IsNull(retrievedCharity);
    }
    else
    {
        Assert.Fail();
    }
}


[Test, Order(9)]
public async Task Backend_Test_GetAll_Method_Get_All_Donations_In_Donation_Service_Fetches_All_Donations_Successfully()
{
    ClearDatabase();

    // Set up user data
    var userData = new Dictionary<string, object>
    {
        { "UserId", 1 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

    // Set up charity data
    var charityData = new Dictionary<string, object>
    {
        { "CharityId", 1 },
        { "CharityName", "Charity One" },
        { "Description", "First charity description" },
        { "Founder", "Founder One" },
        { "CreationDate", DateTime.Now },
        { "Status", "Active" }
    };

    var charity = new Charity();
    foreach (var kvp in charityData)
    {
        var propertyInfo = typeof(Charity).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(charity, kvp.Value);
        }
    }
    _context.Charities.Add(charity);
    _context.SaveChanges();

    // Set up donation data
    var donationData1 = new Dictionary<string, object>
    {
        { "DonationId", 1 },
        { "UserId", 1 },
        { "CharityId", 1 },
        { "Amount", 100.00m },
        { "DonationDate", DateTime.Now}
    };

    var donationData2 = new Dictionary<string, object>
    {
        { "DonationId", 2 },
        { "UserId", 1 },
        { "CharityId", 1 },
        { "Amount", 200.00m },
        { "DonationDate", DateTime.Now}
    };

    var donation1 = new Donation();
    foreach (var kvp in donationData1)
    {
        var propertyInfo = typeof(Donation).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(donation1, kvp.Value);
        }
    }

    var donation2 = new Donation();
    foreach (var kvp in donationData2)
    {
        var propertyInfo = typeof(Donation).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(donation2, kvp.Value);
        }
    }

    _context.Donations.Add(donation1);
    _context.Donations.Add(donation2);
    await _context.SaveChangesAsync();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.DonationService";

    Type serviceType = assembly.GetType(serviceName);

    // Get the GetAllDonations method
    MethodInfo getAllDonationsMethod = serviceType.GetMethod("GetAllDonations");

    // Check if method exists
    if (getAllDonationsMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var retrievedDonationsTask = (Task<IEnumerable<Donation>>)getAllDonationsMethod.Invoke(service, null);
        var retrievedDonations = await retrievedDonationsTask;

        // Assert the retrieved donations are not null and match the expected count
        Assert.IsNotNull(retrievedDonations);
        Assert.AreEqual(2, retrievedDonations.Count());
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(10)]
public async Task Backend_Test_Post_Method_Add_Charity_In_CharityService_Throws_CharityException_If_CharityName_Already_Exists()
{
    ClearDatabase();

    // Set up charity data
    var charityData = new Dictionary<string, object>
    {
        { "CharityId", 1 },
        { "CharityName", "Charity One" },
        { "Description", "First charity description" },
        { "Founder", "Founder One" },
        { "CreationDate", DateTime.Now },
        { "Status", "Active" }
    };

    var charity = new Charity();
    foreach (var kvp in charityData)
    {
        var propertyInfo = typeof(Charity).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(charity, kvp.Value);
        }
    }
    _context.Charities.Add(charity);
    await _context.SaveChangesAsync();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.CharityService";

    Type serviceType = assembly.GetType(serviceName);

    // Get the AddCharity method
    MethodInfo addCharityMethod = serviceType.GetMethod("AddCharity");

    // Check if method exists
    if (addCharityMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);

        // Attempt to add a new charity with the same name
        var newCharityData = new Dictionary<string, object>
        {
            { "CharityId", 2 },
            { "CharityName", "Charity One" },
            { "Description", "Second charity description" },
            { "Founder", "Founder Two" },
            { "CreationDate", DateTime.Now },
            { "Status", "Pending" }
        };

        var newCharity = new Charity();
        foreach (var kvp in newCharityData)
        {
            var propertyInfo = typeof(Charity).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(newCharity, kvp.Value);
            }
        }

        try
        {
            var addCharityTask = (Task<bool>)addCharityMethod.Invoke(service, new object[] { newCharity });
           Console.WriteLine("res" + addCharityTask.Result);
            // If no exception is thrown, fail the test
            Assert.Fail();
        }
        catch (Exception ex)
        {
            Assert.IsNotNull(ex.InnerException);
            Assert.IsTrue(ex.InnerException is CharityException);
            Assert.AreEqual("Charity with the same name already exists", ex.InnerException.Message);
        }
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(11)]
public async Task Backend_Test_Post_Method_AddFeedback_In_Feedback_Service_Posts_Successfully()
{
     ClearDatabase();

    // Add user
    var userData = new Dictionary<string, object>
    {
        { "UserId",42 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();
    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("AddFeedback", new[] { modelType });

    if (method != null)
    {
           var feedbackData = new Dictionary<string, object>
            {
                { "FeedbackId", 11 },
                { "UserId", 42 },
                { "FeedbackText", "Great experience!" },
                { "Date", DateTime.Now }
            };
        var feedback = new Feedback();
        foreach (var kvp in feedbackData)
        {
            var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(feedback, kvp.Value);
            }
        }
        var service = Activator.CreateInstance(serviceType, _context);
        var result = (Task<bool>)method.Invoke(service, new object[] { feedback });
    
        var addedFeedback= await _context.Feedbacks.FindAsync(11);
        Assert.IsNotNull(addedFeedback);
        Assert.AreEqual("Great experience!",addedFeedback.FeedbackText);

    }
    else{
        Assert.Fail();
    }
}

[Test, Order(12)]
public async Task Backend_Test_Delete_Method_Feedback_In_Feeback_Service_Deletes_Successfully()
{
    // Add user
     ClearDatabase();

    var userData = new Dictionary<string, object>
    {
        { "UserId",42 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

           var feedbackData = new Dictionary<string, object>
            {
                { "FeedbackId", 11 },
                { "UserId", 42 },
                { "FeedbackText", "Great experience!" },
                { "Date", DateTime.Now }
            };
        var feedback = new Feedback();
        foreach (var kvp in feedbackData)
        {
            var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(feedback, kvp.Value);
            }
        }
     _context.Feedbacks.Add(feedback);
    _context.SaveChanges();
    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

  
    MethodInfo deletemethod = serviceType.GetMethod("DeleteFeedback", new[] { typeof(int) });

    if (deletemethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var deleteResult = (Task<bool>)deletemethod.Invoke(service, new object[] { 11 });

        var deletedFeedbackFromDb = await _context.Feedbacks.FindAsync(11);
        Assert.IsNull(deletedFeedbackFromDb);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(13)]
public async Task Backend_Test_Get_Method_GetFeedbacksByUserId_In_Feedback_Service_Fetches_Successfully()
{
    ClearDatabase();

    // Add user
    var userData = new Dictionary<string, object>
    {
        { "UserId", 330 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

    var feedbackData= new Dictionary<string, object>
    {
        { "FeedbackId", 13 },
        { "UserId", 330 },
        { "FeedbackText", "Great experience!" },
        { "Date", DateTime.Now }
    };

    var feedback = new Feedback();
    foreach (var kvp in feedbackData)
    {
        var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(feedback, kvp.Value);
        }
    }
    _context.Feedbacks.Add(feedback);
    _context.SaveChanges();

    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("GetFeedbacksByUserId");

    if (method != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var result = ( Task<IEnumerable<Feedback>>)method.Invoke(service, new object[] {330});
        Assert.IsNotNull(result);
         var check=true;
        foreach (var item in result.Result)
        {
            check=false;
            Assert.AreEqual("Great experience!", item.FeedbackText);
   
        }
        if(check==true)
        {
            Assert.Fail();

        }
    }
    else{
        Assert.Fail();
    }
}

private void ClearDatabase()
{
    _context.Database.EnsureDeleted();
    _context.Database.EnsureCreated();
}

}
}

