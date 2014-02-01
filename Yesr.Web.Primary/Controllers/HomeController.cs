using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Yesr.Web.Primary.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home";
            ViewBag.Summary = "";
            return View("Home");
        }

        public ActionResult How(string tab = "gs")
        {
            ViewBag.Title = "How it works!!!!";
            ViewBag.Summary = "This section describes how YESR work! Check out the getting started section for a quick tutorial.";
            ViewBag.Tab = tab;
            return View("How");
        }

        public ActionResult MemberCalculator()
        {
            ViewBag.Title = "Member Calculator";
            ViewBag.Summary = "YESR Member Calculator helps you visualize your bonuses and YBonds in a 12-month period.";
            return View("MemberCalculator");
        }

        public ActionResult MerchantCalculator()
        {
            ViewBag.Title = "Merchant Calculator";
            ViewBag.Summary = "YESR Merchant Calculator helps you visualize your revenue, discount and referral bonus in a 12-month period.";
            return View("MerchantCalculator");
        }

        public ActionResult YesrCalculator()
        {
            ViewBag.Title = "Yesr Calculator";
            ViewBag.Summary = "YESR Calculator helps you visualize your admin fee, fund fee, wallet money and referral bonus in a 12-month period.";
            return View("YesrCalculator");
        }

        public ActionResult Activation()
        {
            ViewBag.Title = "Activation";
            ViewBag.Summary = "To activate your YESR membership, you will need an activation code! The activation code has been sent via SMS to your mobile you used while registering for YESR.";
            return View("Activation");
        }

        public ActionResult Merchants(string id = "")
        {
            ViewBag.Title = "Discount Providers " + id;
            ViewBag.Summary = "This page will show YESR Discount Providers as thumbnails with drill down to details.";
            return View("Merchants");
        }

        public ActionResult Glossary()
        {
            ViewBag.Title = "Glossary";
            ViewBag.Summary = "This page will contain a glossary of YESR terms....";
            return View("Glossary");
        }

        public ActionResult About()
        {
            ViewBag.Title = "About";
            ViewBag.Summary = "Show YESR About....";
            return View("About");
        }

        public ActionResult Contact()
        {
            ViewBag.Title = "Contact";
            ViewBag.Summary = "Show YESR Contact....";
            return View("Contact");
        }

        public ActionResult Merchant(string id)
        {
            ViewBag.Title = "Discount Provider " + id;
            ViewBag.Summary = "Show YESR Discount Provider....";
            return View("Merchant");
        }

        // Partial Views

        /// <summary>
        /// This attribute (ChildActionOnly) prevents the controller from servicing BestMerchant on its own as in:
        /// http://site/merchants/BestMerchant
        /// </summary>
        /// <returns></returns>
        [ChildActionOnly]
        public PartialViewResult GettingStarted1()
        {
            return PartialView("_GettingStarted1");
        }
    }
}
