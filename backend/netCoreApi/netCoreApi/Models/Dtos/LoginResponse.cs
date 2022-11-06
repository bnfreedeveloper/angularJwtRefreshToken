namespace netCoreApi.Models.Dtos
{
    public class LoginResponse
    {
        public string? Token { get; set; }   
        public string? RefreshToken { get;set; }
        public DateTime Expiration { get; set; }    
        public string? Name { get; set; }    
        public string? UserName { get; set; }    
        public bool? Success { get; set; }
        public string? Message { get; set; }
    }
}
