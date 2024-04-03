using Co2HomeEmissionsTP36.Models;
using Co2HomeEmissionsTP36.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Co2HomeEmissionsTP36TestProject;

public class IntegrationTests
{
    private readonly SavingsContext _context;
    
    public IntegrationTests()
    {
        // Get connection strings from the main asp.net project
        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();
        
        var services = new ServiceCollection()
            .AddDbContext<SavingsContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
            )
            .BuildServiceProvider();
        
        _context = services.CreateScope().ServiceProvider.GetRequiredService<SavingsContext>();
    }
    
    [Fact]
    public async Task QueryApi()
    {
        var httpClient = new HttpClient();
        var apiUrl = "https://savingsfinder.service.vic.gov.au/v1/savings/";

        var response = await httpClient.GetAsync(apiUrl);

        Assert.True(response.IsSuccessStatusCode);
    }
    
    [Fact]
    public void DatabaseIntegrationTests()
    {
        /* Insert Data Into Database */
        var newData = new Savings
        {
            SavingsId = 0
        };
        
        _context.savings.Add(newData);
        _context.SaveChanges();
        
        // Query the database to check if data was inserted
        var insertedData = _context.savings.FirstOrDefault(s => s.SavingsId == 1); // Query the database to check if data was inserted
        Assert.NotNull(insertedData); // Assert that the inserted data exists in the database
        
        /* Delete Data From Database */
        _context.savings.Remove(insertedData);
        _context.SaveChanges();
        
        // Query the database to check if data was deleted
        var deletedData = _context.savings.FirstOrDefault(s => s.SavingsId == 1);
        Assert.Null(deletedData); // Assert that the deleted data does not exist in the database
    }
}
