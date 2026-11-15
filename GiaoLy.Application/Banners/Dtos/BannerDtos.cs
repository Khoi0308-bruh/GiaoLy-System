using System;

namespace GiaoLy.Application.Banners.Dtos;

public class BannerDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public int OrderIndex { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateBannerRequest
{
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public int OrderIndex { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

public class UpdateBannerRequest
{
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public int OrderIndex { get; set; }
    public bool IsActive { get; set; }
}
