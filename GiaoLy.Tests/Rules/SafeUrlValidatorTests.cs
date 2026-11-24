using System.Net;
using GiaoLy.Domain.Rules;
using Xunit;

namespace GiaoLy.Tests.Rules;

/// <summary>
/// Proxy ảnh tin tức tải URL do nội dung RSS cung cấp, nên đây là bề mặt SSRF:
/// phải chặn loopback, IP nội bộ, metadata cloud và cổng không chuẩn.
/// </summary>
public class SafeUrlValidatorTests
{
    [Theory]
    [InlineData("http://localhost/anh.jpg")]
    [InlineData("http://127.0.0.1/anh.jpg")]
    [InlineData("http://169.254.169.254/latest/meta-data/")]
    [InlineData("http://10.0.0.5/anh.jpg")]
    [InlineData("http://192.168.1.10/anh.jpg")]
    [InlineData("http://172.20.0.1/anh.jpg")]
    [InlineData("http://metadata.google.internal/computeMetadata/v1/")]
    [InlineData("http://may-chu.local/anh.jpg")]
    [InlineData("file:///etc/passwd")]
    [InlineData("ftp://example.com/anh.jpg")]
    [InlineData("http://example.com:8080/anh.jpg")]
    [InlineData("http://user:matkhau@example.com/anh.jpg")]
    [InlineData("khong-phai-url")]
    [InlineData("")]
    [InlineData(null)]
    public void TryValidate_ChanDiaChiKhongAnToan(string? url)
    {
        var ok = SafeUrlValidator.TryValidateAndGetSafeUri(url, out var uri, out var error);

        Assert.False(ok);
        Assert.Null(uri);
        Assert.False(string.IsNullOrWhiteSpace(error));
    }

    [Fact]
    public void TryValidate_ChapNhanUrlCongKhai()
    {
        // IP công khai để test không phụ thuộc DNS.
        var ok = SafeUrlValidator.TryValidateAndGetSafeUri("https://203.0.113.5/anh.jpg", out var uri, out var error);

        Assert.True(ok);
        Assert.NotNull(uri);
        Assert.Null(error);
        Assert.Equal("203.0.113.5", uri!.Host);
    }

    [Theory]
    [InlineData("10.1.2.3", true)]
    [InlineData("127.0.0.1", true)]
    [InlineData("169.254.1.1", true)]
    [InlineData("172.16.5.4", true)]
    [InlineData("172.32.5.4", false)]
    [InlineData("192.168.0.1", true)]
    [InlineData("0.0.0.0", true)]
    [InlineData("8.8.8.8", false)]
    [InlineData("203.0.113.5", false)]
    public void IsPrivateOrReservedIp_NhanDienDungDaiDiaChi(string ip, bool expected)
    {
        Assert.Equal(expected, SafeUrlValidator.IsPrivateOrReservedIp(IPAddress.Parse(ip)));
    }

    [Fact]
    public void IsPrivateOrReservedIp_ChanIpv6Loopback()
    {
        Assert.True(SafeUrlValidator.IsPrivateOrReservedIp(IPAddress.IPv6Loopback));
    }
}
