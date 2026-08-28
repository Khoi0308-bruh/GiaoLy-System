using System;

namespace GiaoLy.Domain.Entities;

public class DutyAssignment
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ClassRoomId { get; set; }
    public DateTime DutyDate { get; set; }
    public string RoleName { get; set; } = string.Empty; // e.g. "Dạy chính", "Phụ tá", "Trực cổng"
    public string Note { get; set; } = string.Empty;
}
