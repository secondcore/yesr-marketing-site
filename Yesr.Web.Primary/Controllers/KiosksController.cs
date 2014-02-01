using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Yesr.Web.Primary.Controllers
{
    public class KiosksController : Controller
    {
        public ActionResult Merchant()
        {
            ViewBag.Title = "Merchant Kiosk";
            return View("Merchant", "~/Views/Shared/_KioskLayout.cshtml", null);
        }

        public ActionResult DiscountProvider()
        {
            ViewBag.Title = "Discount Provider Kiosk";
            return View("DiscountProvider", "~/Views/Shared/_KioskLayout.cshtml", null);
        }

        public ActionResult Nbc()
        {
            ViewBag.Title = "Nbc Kiosk";
            return View("Nbc", "~/Views/Shared/_KioskLayout.cshtml", null);
        }
    }
}
