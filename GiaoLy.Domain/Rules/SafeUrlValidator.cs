using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;

namespace GiaoLy.Domain.Rules;

public static class SafeUrlValidator
{
    private static readonly HashSet<string> AllowedSchemes = new(StringComparer.OrdinalIgnoreCase)
    {
        "http",
        "https"
    };

    public static bool TryValidateAndGetSafeUri(string? url, out Uri? validUri, out string? errorMessage)
    {
        validUri = null;
        errorMessage = null;

        if (string.IsNullOrWhiteSpace(url))
        {
            errorMessage = "Đường dẫn không được để trống";
            return false;
        }

        if (!Uri.TryCreate(url.Trim(), UriKind.Absolute, out var uri))
        {
            errorMessage = "Địa chỉ URL không hợp lệ";
            return false;
        }

        if (!AllowedSchemes.Contains(uri.Scheme))
        {
            errorMessage = "Chỉ cho phép giao thức http hoặc https";
            return false;
        }

        if (!string.IsNullOrEmpty(uri.UserInfo))
        {
            errorMessage = "Không cho phép thông tin đăng nhập trong URL";
            return false;
        }

        if (uri.Port != 80 && uri.Port != 443 && uri.Port != -1)
        {
            errorMessage = "Chỉ cho phép cổng tiêu chuẩn (80 hoặc 443)";
            return false;
        }

        var host = uri.DnsSafeHost;

        // Block localhost, cloud metadata, and internal aliases
        if (string.Equals(host, "localhost", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(host, "metadata.google.internal", StringComparison.OrdinalIgnoreCase) ||
            host.EndsWith(".local", StringComparison.OrdinalIgnoreCase) ||
            host.EndsWith(".internal", StringComparison.OrdinalIgnoreCase))
        {
            errorMessage = "Không được phép truy cập tên miền nội bộ";
            return false;
        }

        // Try IP resolution and check against private / reserved IP ranges
        if (IPAddress.TryParse(host, out var ip))
        {
            if (IsPrivateOrReservedIp(ip))
            {
                errorMessage = "Không cho phép kết nối đến địa chỉ IP riêng hoặc loopback";
                return false;
            }
        }
        else
        {
            try
            {
                var addresses = Dns.GetHostAddresses(host);
                if (addresses.Length == 0)
                {
                    errorMessage = "Không phân giải được tên miền";
                    return false;
                }

                foreach (var addr in addresses)
                {
                    if (IsPrivateOrReservedIp(addr))
                    {
                        errorMessage = "Tên miền trỏ tới dải địa chỉ IP riêng hoặc loopback";
                        return false;
                    }
                }
            }
            catch
            {
                errorMessage = "Không thể phân giải tên miền chỉ định";
                return false;
            }
        }

        validUri = uri;
        return true;
    }

    public static bool IsPrivateOrReservedIp(IPAddress ip)
    {
        if (IPAddress.IsLoopback(ip)) return true;

        if (ip.AddressFamily == AddressFamily.InterNetworkV6)
        {
            if (ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal || ip.IsIPv6Multicast)
                return true;
            return false;
        }

        var bytes = ip.GetAddressBytes();
        if (bytes.Length != 4) return true;

        // 0.0.0.0/8 (Broadcast/This network)
        if (bytes[0] == 0) return true;

        // 10.0.0.0/8 (Private)
        if (bytes[0] == 10) return true;

        // 127.0.0.0/8 (Loopback)
        if (bytes[0] == 127) return true;

        // 169.254.0.0/16 (Link Local / Cloud Metadata)
        if (bytes[0] == 169 && bytes[1] == 254) return true;

        // 172.16.0.0/12 (Private 172.16.0.0 - 172.31.255.255)
        if (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31) return true;

        // 192.168.0.0/16 (Private)
        if (bytes[0] == 192 && bytes[1] == 168) return true;

        // 224.0.0.0/4 (Multicast 224.0.0.0 - 239.255.255.255)
        if (bytes[0] >= 224 && bytes[0] <= 239) return true;

        // 240.0.0.0/4 (Reserved)
        if (bytes[0] >= 240) return true;

        return false;
    }
}
