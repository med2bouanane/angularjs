using System.Web;
using System.Web.Mvc;

namespace SolidQ.GNFNavidad14.WebUI
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
