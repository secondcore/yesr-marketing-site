using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Yesr.Web.Primary.Controllers
{
    public class MembersController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Dashboard";
            ViewBag.Summary = "Activation code: 872635 - Membership Number: 999888777616255 - Last Purchase: 13 Feb 2012";
            return View("Index", "~/Views/Shared/_MembersLayout.cshtml", null);
        }
    }
}
