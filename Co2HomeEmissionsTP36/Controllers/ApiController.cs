using Microsoft.AspNetCore.Mvc;
using Co2HomeEmissionsTP36.Data;
using Co2HomeEmissionsTP36.Models;
using Microsoft.EntityFrameworkCore;

namespace Co2HomeEmissionsTP36.Controllers;

[ApiController]
public class ApiController : Controller
{
    private readonly DataContext _context;
    
    public ApiController(DataContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    [Route("api/energy")]
    public async Task<ActionResult<IEnumerable<object>>> GetEnergy()
    {
        var result = await _context.energy
            .Join(
                _context.emissionFactor,
                e => e.EnergyId,
                ef => ef.EnergyId,
                (e, ef) => new
                {
                    e.EnergyId,
                    e.EnergyName,
                    e.EnergyContentFactor,
                    ef.ScopeOneEmission,
                    ef.ScopeTwoEmission,
                    ef.ScopeThreeEmission,
                })
            .ToListAsync();

        return Ok(result);
    }
    
    [HttpGet]
    [Route("api/consumption")]
    public async Task<ActionResult<IEnumerable<EnergyConsumption>>> GetConsumption()
    {
        return Ok(await _context.energyConsumption.Select(c => new
        {
            c.ConsumptionId,
            c.Year,
            c.HouseholdNum,
            c.EmissionAmount
        }).ToListAsync());
    }
}
