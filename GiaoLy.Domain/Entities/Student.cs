namespace GiaoLy.Domain.Entities;

using GiaoLy.Domain.Enums;

public class Student
{
    public Guid Id { get; set; }
    public string HolyName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }

    public DateTime? BaptismDate { get; set; }
    public string? BaptismPlace { get; set; }
    public DateTime? CommunionDate { get; set; }
    public string? CommunionPlace { get; set; }
    public DateTime? ConfirmationDate { get; set; }
    public string? ConfirmationPlace { get; set; }

    // Lưu ý: Vì chúng ta chưa dùng Enum phức tạp, tạm thời để kiểu int hoặc string 
    // để tránh lỗi build nếu bạn chưa tạo file Enum
    public HolyBranch Branch { get; set; }
    public string? ClassName { get; set; }
    public bool IsActive { get; set; } = true;

    // --- Thông tin bổ sung ---
    public string? Gender { get; set; }
    public string? Area { get; set; }
    
    // --- Gia Đình ---
    public Guid? FamilyId { get; set; }
    public Family? Family { get; set; }
    public string? FatherName { get; set; }
    public string? FatherPhone { get; set; }
    public string? FatherReligion { get; set; }
    public string? FatherJob { get; set; }
    
    public string? MotherName { get; set; }
    public string? MotherPhone { get; set; }
    public string? MotherReligion { get; set; }
    public string? MotherJob { get; set; }
    
    public string? ParentName { get; set; } // Keep for legacy
    public string? ParentPhone { get; set; }
    public string? Address { get; set; }
    
    // --- Y tế & Khác ---
    public string? BloodType { get; set; }
    public string? Allergies { get; set; }
    public string? Notes { get; set; }
    public string? PhotoUrl { get; set; }
    
    // --- Chi tiết Bí Tích ---
    public string? BaptismGodparent { get; set; }
    public string? BaptismPriest { get; set; }
    public string? CommunionPriest { get; set; }
    public string? ConfirmationGodparent { get; set; }
    public string? ConfirmationBishop { get; set; }
}