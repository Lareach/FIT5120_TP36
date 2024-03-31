using Microsoft.AspNetCore.Mvc;
using Co2HomeEmissionsTP36.Data;
using Co2HomeEmissionsTP36.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Co2HomeEmissionsTP36.Controllers;

public class QuestionnaireController : Controller
{
    private readonly SavingsContext _context;
    
    public QuestionnaireController(SavingsContext context)
    {
        _context = context;
    }
    
    // GET: Questionnaire/Index
    public IActionResult Index()
    {
        return View();
    }
    
    // POST: Questionnaire/Results
    [HttpPost]
    public async Task<IActionResult> Results()
    {
        var response = await GetSavingsData();
        
        if (response.IsSuccessStatusCode)
        {
            string contents = await response.Content.ReadAsStringAsync();

            // checks the savings data for new records and updates database
            await RefreshSavingsData(contents);
        }
        
        return View();
    }

    private static async Task<HttpResponseMessage> GetSavingsData()
    {
        const string apiUrl = "https://savingsfinder.service.vic.gov.au/v1/savings/";

        // Make an HTTP GET request to the web API
        return await new HttpClient().GetAsync(apiUrl);
    }
    
    private async Task RefreshSavingsData(string contents)
    {
        JsonDocument doc = JsonDocument.Parse(contents);

        if (doc.RootElement.TryGetProperty("data", out JsonElement dataArray))
        {
            var categoryIdList = await _context.category.Select(c => c.CategoryId).ToListAsync();
            var concessionIdList = await _context.concession.Select(c => c.ConcessionId).ToListAsync();
            var savingsIdList = await _context.savings.Select(c => c.SavingsId).ToListAsync();

            foreach (JsonElement item in dataArray.EnumerateArray())
            {
                int categoryId = item.GetProperty("category_id").GetInt32();
                string? categoryName = item.GetProperty("category_name").GetString();

                if (!categoryIdList.Contains(categoryId))
                {
                    _context.Add(new SavingsCategory() { CategoryId = categoryId, CategoryName = categoryName });
                    await _context.SaveChangesAsync();
                }

                string? concessionIds = item.GetProperty("taxonomy_ids").GetString();
                string? concessionNames = item.GetProperty("taxonomy_names").GetString();

                if (concessionIds != null && concessionNames != null)
                {
                    List<int> concessionId = concessionIds.Split(',').Select(int.Parse).ToList();
                    List<string> concessionName = concessionNames.Split(',').Select(x => x.Trim()).ToList();

                    for (int i = 0; i < concessionId.Count; i++)
                    {
                        if (!concessionIdList.Contains(concessionId[i]))
                        {
                            _context.Add(new Concession() { ConcessionId = concessionId[i], ConcessionName = concessionName[i] });
                            await _context.SaveChangesAsync();
                        }
                    }
                }

                int savingsId = item.GetProperty("savings_id").GetInt32();
                string? title = item.GetProperty("title").GetString();
                string? description = item.GetProperty("description").GetString();
                string? method = item.GetProperty("method").GetString();
                string? duration = item.GetProperty("duration").GetString();
                string? eligibilityRequirements = item.GetProperty("eligibility_requirements").GetString();
                string? ctaUrl = item.GetProperty("cta_url").GetString();

                if (!savingsIdList.Contains(savingsId))
                {
                    _context.Add(new Savings()
                    {
                        SavingsId = savingsId,
                        Title = title,
                        Description = description,
                        Method = method,
                        Duration = duration,
                        EligibilityRequirements = eligibilityRequirements,
                        CtaUrl = ctaUrl,
                        CategoryId = categoryId
                    });
                    await _context.SaveChangesAsync();
                }

                if (concessionIds != null)
                {
                    List<int> concessionId = concessionIds.Split(',').Select(int.Parse).ToList();

                    foreach (int id in concessionId)
                    {
                        concessionIdList = await _context.concession.Select(c => c.ConcessionId).ToListAsync();
                        savingsIdList = await _context.savings.Select(c => c.SavingsId).ToListAsync();

                        if (savingsIdList.Contains(savingsId) && concessionIdList.Contains(id))
                        {
                            _context.Add(new SavingsConcession() { SavingsId = savingsId, ConcessionId = id });
                            await _context.SaveChangesAsync();
                        }
                    }
                }
            }
        }
    }
}
