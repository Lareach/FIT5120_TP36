using Microsoft.AspNetCore.Mvc;

namespace Co2HomeEmissionsTP36.Controllers;

public class PhotovoltaicController : Controller
{
    public PhotovoltaicController()
    {

    }

    // GET: Photovoltaic/Index
    public IActionResult Index()
    {
        return View();
    }
}
