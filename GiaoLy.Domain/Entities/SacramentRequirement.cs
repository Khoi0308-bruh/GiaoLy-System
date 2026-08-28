using System;

namespace GiaoLy.Domain.Entities;

public class SacramentRequirement
{
    public Guid Id { get; set; }
    public string SacramentType { get; set; } = string.Empty; // e.g. "Rước Lễ Lần Đầu", "Thêm Sức"
    public string Name { get; set; } = string.Empty; // e.g. "Giấy Rửa Tội", "Tĩnh tâm"
    public int Order { get; set; }
}
