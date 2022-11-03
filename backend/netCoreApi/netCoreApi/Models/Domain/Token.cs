namespace netCoreApi.Models.Domain
{
    public class Token
    {
        public int Id { get; set; } 
        public string UserName { get; set; }    
        public string RefreshToken { get; set; }    
        public DateTime Created { get; set; }
    }
}
