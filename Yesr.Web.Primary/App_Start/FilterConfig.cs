using System.Web;
using System.Web.Mvc;

namespace Yesr.Web.Primary
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}