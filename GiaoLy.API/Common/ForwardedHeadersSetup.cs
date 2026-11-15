using System.Net;
using Microsoft.AspNetCore.HttpOverrides;

namespace GiaoLy.API.Common;

/// <summary>
/// Cấu hình ForwardedHeaders theo proxy tin cậy khai báo trong cấu hình.
/// Mặc định ASP.NET chỉ tin loopback; ở đây giữ nguyên mặc định đó trừ khi
/// cấu hình "ReverseProxy" chỉ rõ proxy/network của hạ tầng thật.
/// </summary>
public static class ForwardedHeadersSetup
{
    public const string SectionName = "ReverseProxy";

    /// <summary>Trả về null khi tắt tính năng (ReverseProxy:Enabled = false).</summary>
    public static ForwardedHeadersOptions? Build(IConfiguration config, ILogger logger)
    {
        var section = config.GetSection(SectionName);
        if (!section.GetValue("Enabled", true))
        {
            logger.LogWarning("ReverseProxy:Enabled = false — bỏ qua X-Forwarded-For/Proto, dùng địa chỉ kết nối trực tiếp.");
            return null;
        }

        var options = new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
            ForwardLimit = section.GetValue<int?>("ForwardLimit") ?? 1
        };

        var knownProxies = section.GetSection("KnownProxies").Get<string[]>() ?? [];
        var knownNetworks = section.GetSection("KnownNetworks").Get<string[]>() ?? [];

        if (knownProxies.Length == 0 && knownNetworks.Length == 0)
        {
            // Không khai báo gì: chỉ tin loopback (mặc định an toàn của ASP.NET Core).
            return options;
        }

        // Có khai báo thì thay hẳn danh sách mặc định, để cấu hình phản ánh đúng hạ tầng.
        options.KnownProxies.Clear();
        options.KnownIPNetworks.Clear();

        foreach (var entry in knownProxies)
        {
            if (IPAddress.TryParse(entry, out var proxy))
            {
                options.KnownProxies.Add(proxy);
            }
            else
            {
                logger.LogWarning("ReverseProxy:KnownProxies có giá trị không phải IP hợp lệ: {Value}", entry);
            }
        }

        foreach (var entry in knownNetworks)
        {
            if (System.Net.IPNetwork.TryParse(entry, out var network))
            {
                options.KnownIPNetworks.Add(network);
            }
            else
            {
                logger.LogWarning("ReverseProxy:KnownNetworks có giá trị không phải CIDR hợp lệ: {Value}", entry);
            }
        }

        if (options.KnownProxies.Count == 0 && options.KnownIPNetworks.Count == 0)
        {
            // Cấu hình sai hết: quay về mặc định an toàn thay vì tin mọi nguồn.
            logger.LogError("ReverseProxy được khai báo nhưng không có proxy/network hợp lệ — chỉ tin loopback.");
            options.KnownProxies.Add(IPAddress.Loopback);
            options.KnownProxies.Add(IPAddress.IPv6Loopback);
            options.KnownIPNetworks.Add(new System.Net.IPNetwork(IPAddress.Loopback, 8));
        }

        return options;
    }
}
