using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Diagnostics;

namespace Co2HomeEmissionsTP36.Controllers;

public class RecyclingController : Controller
{
    //private readonly string _apiServer = "https://8zb2oanzdl.azurewebsites.net/upload";
    private readonly string _apiServer = "http://localhost:5000/upload";

    public RecyclingController()
    {

    }

    // GET: Recycling/Index
    public IActionResult Index()
    {
        return View();
    }

    // POST: Recycling/Index
    [HttpPost]
    public async Task<IActionResult> Index(IFormFile imageFile)
    {
        if(imageFile.Length > 0)
        {
            if(!IsImageTypeSupported(imageFile.ContentType))
            {
                ModelState.AddModelError("imageFile", "The selected file is not a supported image type.");
                return View();
            }

            // Read the image file into a byte array
            byte[] imageData;
            using(var stream = new MemoryStream())
            {
                await imageFile.CopyToAsync(stream);
                imageData = stream.ToArray();
            }

            var data = new
            {
                image = Convert.ToBase64String(imageData),
            };
            
            var response = await new HttpClient().PostAsync(_apiServer, 
                new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json"));

            HttpStatusCode statusCode = response.StatusCode;

            // Check if the request was not successful
            if(!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"HTTP request failed with status code: {(int)statusCode} - {statusCode}");
                return View("Error");
            }
            
            // Read the JSON data from the response
            var result = await response.Content.ReadAsStringAsync();
            var values = JsonSerializer.Deserialize<Dictionary<string, string>>(result);

            // Pass the JSON data to the view
            return View("Index", values);
        }

        // If no file was selected, return to the same page
        return RedirectToAction(nameof(Index));
    }

    private static bool IsImageTypeSupported(string contentType)
    {
        string[] supportedImageTypes = ["image/jpg", "image/jpeg", "image/png"];

        foreach (string supportedType in supportedImageTypes)
        {
            if (contentType.Equals(supportedType, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }
        return false;
    }
}
