using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PruebaBG.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace PruebaBG.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UrlController : ControllerBase
    {
       
        private readonly ILogger<WeatherForecastController> _logger;
        public static List<ShortUrl> Datos = new List<ShortUrl>();
        public UrlController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<ShortUrl> Get()
        {
            return Datos;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Url url)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var ip = HttpContext.Connection.RemoteIpAddress;
                    var uri = HttpContext.Request.ToUri();
                    ShortUrl shortUrl = await this.ShortenUrl(url.LongURL, ip.ToString(), url.CustomSegment);
                    url.ShortURL = string.Format("{0}://{1}{2}", uri.Scheme, Url.Content("~"), shortUrl.Segment);
                    return Ok(url);
                }
				return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

	
		public Task<ShortUrl> ShortenUrl(string longUrl, string ip, string segment = "")
		{
			return Task.Run(() =>
			{
				
				ShortUrl url;
				url = Datos.Where(u => u.LongUrl == longUrl).FirstOrDefault();
				if (url != null) return url;
				if (!longUrl.StartsWith("http://") && !longUrl.StartsWith("https://"))
				{
					throw new ArgumentException("La URL es inválida");
				}
				Uri urlCheck = new Uri(longUrl);
				HttpWebRequest request = (HttpWebRequest)WebRequest.Create(urlCheck);
				request.Timeout = 10000;
				try
				{
					HttpWebResponse response = (HttpWebResponse)request.GetResponse();
				}
				catch (Exception)
				{
					throw new Exception("La URL, no responde");
				}

				segment = this.NewSegment();

				if (string.IsNullOrEmpty(segment))
				{
					throw new ArgumentException("No se pudo crear la URL corta");
				}
				var id = 0;
                if (Datos.Any())
                {
                    id = Datos.Max(d => d.Id);
                }
				url = new ShortUrl()
				{
					Added = DateTime.Now,
					Ip = ip,
					LongUrl = longUrl,
					Segment = segment,
					Id = id + 1
				};
				Datos.Add(url);
				return url;
			});
		}

		private string NewSegment()
		{
			int i = 0;
			while (true)
			{
				string segment = $"bg.{Guid.NewGuid().ToString().Substring(0, 5)}";
				if (!Datos.Where(u => u.Segment == segment).Any())
				{
					return segment;
				}
				if (i > 30)
				{
					break;
				}
				i++;
			}
			return string.Empty;
		}
	}

	public static class HttpRequestExtensions
	{
		public static Uri ToUri(this HttpRequest request)
		{
			var hostComponents = request.Host.ToUriComponent().Split(':');

			var builder = new UriBuilder
			{
				Scheme = request.Scheme,
				Host = hostComponents[0],
				Path = request.Path,
				Query = request.QueryString.ToUriComponent()
			};

			if (hostComponents.Length == 2)
			{
				builder.Port = Convert.ToInt32(hostComponents[1]);
			}

			return builder.Uri;
		}
	}
}
