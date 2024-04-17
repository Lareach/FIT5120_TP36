using Microsoft.AspNetCore.Mvc;
using Co2HomeEmissionsTP36.Data;
using Co2HomeEmissionsTP36.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Co2HomeEmissionsTP36.Controllers;

public class CarbonCalculatorController : Controller
{
    private readonly SavingsContext _context;

    public CarbonCalculatorController(SavingsContext context)
    {
        _context = context;
    }

    // GET: CarbonCalculator/Index
    public IActionResult Index()
    {
        return View();
    }


}
