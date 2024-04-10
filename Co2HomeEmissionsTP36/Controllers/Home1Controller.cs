using Co2HomeEmissionsTP36.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Co2HomeEmissionsTP36.Controllers;

public class Home1Controller : Controller
{
	private readonly ILogger<Home1Controller> _logger;

	public Home1Controller(ILogger<Home1Controller> logger)
	{
		_logger = logger;
	}
	
	public IActionResult Index()
	{
		return View("~/Views/Iteration1/Home/Index.cshtml");
	}
	
	public IActionResult Privacy()
	{
		return View("~/Views/Iteration1/Home/Privacy.cshtml");
	}
	
	public IActionResult ClimateAction()
	{
		return View("~/Views/Iteration1/Home/ClimateAction.cshtml");
	}
	
	public IActionResult GovernmentalSupport()
	{
		return View("~/Views/Iteration1/Home/GovernmentalSupport.cshtml");
	}
	
	[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
	public IActionResult Error()
	{
		return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
	}
}
