namespace Co2HomeEmissionsTP36TestProject;

public class IntegrationTests
{
    [Fact]
    public async Task Test1()
    {
        var httpClient = new HttpClient();
        var apiUrl = "https://savingsfinder.service.vic.gov.au/v1/savings/";

        var response = await httpClient.GetAsync(apiUrl);

        Assert.True(response.IsSuccessStatusCode);
    }
}
